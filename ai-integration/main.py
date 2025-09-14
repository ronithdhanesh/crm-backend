import os
from dotenv import load_dotenv
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import JsonOutputParser

load_dotenv()

def create_campaign_rule(text):
    
    llm = ChatGoogleGenerativeAI(
    model="gemini-1.5-flash",
    api_key=os.getenv("GOOGLE_API_KEY")
    )

    template = template =  """
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
    result = chain.invoke({"user_query":text})
    return result 

text = "Find customers who have spent over 500 dollars and visited less than 3 times"

rule = create_campaign_rule(text)

print(rule)