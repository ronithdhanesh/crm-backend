from fastapi import FastAPI
from pydantic import BaseModel
from langchain_groq import ChatGroq
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import JsonOutputParser
from dotenv import load_dotenv
import os
import json


load_dotenv()

app = FastAPI()

class PromptRequest(BaseModel):
    text: str

def create_campaign_rule_chain():
    llm = ChatGroq(
        model="llama-3.3-70b-versatile",
        api_key=os.getenv("GROQ_API_KEY")
    )

    template = """
    You are a helpful assistant that converts natural language queries into a structured JSON object for a customer segmentation system.

    Your task is to convert the following user query into a JSON object with a 'combinator' field and a 'rules' array. Each rule object must have 'field', 'operator', and 'value'.

    Here are the available fields and their data types from the customer database:
    - totalSpend (Number)
    - visits (Number)
    - lastPurchaseDate (Date)

    Here are the valid operators for each data type:
    - Numbers: >, <, >=, <=, ==, !=
    - Dates: >, <, ==, != (to compare dates)

    The valid combinators are '$and' and '$or'.

    Example Input:
    "Find customers who have spent over 500 dollars and visited less than 3 times."

    Example Output:
    {{
        "combinator": "$and",
        "rules": [
            {{"field": "totalSpend", "operator": ">", "value": 500}},
            {{"field": "visits", "operator": "<", "value": 3}}
        ]
    }}

    Always use the exact field names, operators, and combinators provided.
    For dates, use a relative format like 'X months ago' or a specific format 'YYYY-MM-DD'.
    If no combinator is specified, use '$and' by default.
    Do not add any additional text or explanations to the response.
    
    User Query: {user_query}
    """

    prompt = ChatPromptTemplate.from_template(template)
    json_parser = JsonOutputParser()
    chain = prompt | llm | json_parser
    return chain

@app.post("/generate-rules")
async def generate_rules_endpoint(request: PromptRequest):
    try:
        chain = create_campaign_rule_chain()
        result = chain.invoke({"user_query": request.text})

        if isinstance(result, dict):
            return result
        else:
            return json.loads(result)

    except Exception as e:
        return {"error": str(e)}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)