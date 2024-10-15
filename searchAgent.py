import asyncio
from gpt_researcher import GPTResearcher

from dotenv import load_dotenv

load_dotenv()

results_dict = {}

async def main(query: str)-> str:
    """ Conduct research on the given query and write a report """   
    # Report Type
    report_type = "research_report"

    # Initialize the researcher
    researcher = GPTResearcher(query=query, report_type=report_type)
    # Conduct research on the given query
    await researcher.conduct_research()
    # Write the report
    report = await researcher.write_report()
    results_dict["research"] = report
    return report


def research(query: str):
    """ Conduct a medical research on the given query and write a medical report 
    args:
        query: str: The query to be researched"""
    asyncio.run(main(query))
    if results_dict["research"]:
        return results_dict["research"]



def retrive_tools_results():
    """Retrieve the results of the tools"""

    return results_dict

# print(research("What is the cause of diabetes?"))
    
