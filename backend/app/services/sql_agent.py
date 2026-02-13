"""
SQL Agent Service
LangChain SQL agent for natural language to SQL conversion
"""
from typing import Optional, Dict, Any
from langchain_community.utilities import SQLDatabase
from langchain_community.agent_toolkits import SQLDatabaseToolkit
from langchain_community.agent_toolkits import create_sql_agent
from app.config import settings
from app.services.llm_provider import get_llm


class SQLAgentService:
    """Service for handling SQL database queries using LangChain SQL Agent"""
    
    _instance: Optional["SQLAgentService"] = None
    
    def __new__(cls):
        """Singleton pattern"""
        if cls._instance is None:
            cls._instance = super().__new__(cls)
            cls._instance._initialized = False
        return cls._instance
    
    def __init__(self):
        """Initialize the SQL agent"""
        if self._initialized:
            return
        
        # Connect to the database
        self.db = SQLDatabase.from_uri(
            settings.DATABASE_URL,
            include_tables=[
                "students", "faculty", "courses", "events",
                "departments", "admissions", "facilities"
            ],
        )
        
        self._initialized = True
        self._agent = None
    
    def _get_agent(self):
        """Lazy initialization of the agent (requires LLM)"""
        if self._agent is None:
            llm = get_llm(temperature=0)
            
            # Create toolkit
            toolkit = SQLDatabaseToolkit(db=self.db, llm=llm)
            
            # Custom prefix for the agent
            prefix = """You are an agent designed to interact with KL University's SQL database.
Given a question, create a syntactically correct SQLite query, execute it, and return the results in natural language.

Important guidelines:
1. Always be specific and accurate with your queries.
2. Never modify the database - only use SELECT queries.
3. If you don't know the answer, say so clearly.
4. When counting or aggregating, always verify your query is correct.
5. Use proper table aliases when joining tables.
6. For department queries, note that department names may be stored as full names or abbreviations.

Available tables and their purposes:
- students: Student information (student_id, name, email, department, year, section, cgpa, phone, enrollment_date)
- faculty: Faculty members (faculty_id, name, email, department, designation, specialization, phone)
- courses: Course offerings (course_code, course_name, department, credits, semester, faculty_id, description)
- events: Campus events (event_name, description, event_date, venue, organizer, event_type)
- departments: Department info (dept_code, dept_name, hod_name, total_faculty, total_students, building, floor)
- admissions: Admission details (program, department, total_seats, available_seats, last_date, eligibility, fee_per_semester)
- facilities: Campus facilities (facility_name, location, timings, contact, description)

Common department names:
- CSE = Computer Science and Engineering
- ECE = Electronics and Communication Engineering
- EEE = Electrical and Electronics Engineering
- MECH = Mechanical Engineering
- CIVIL = Civil Engineering
- MBA = Master of Business Administration"""
            
            # Create the agent
            self._agent = create_sql_agent(
                llm=llm,
                toolkit=toolkit,
                verbose=settings.DEBUG,
                prefix=prefix,
                handle_parsing_errors=True,
            )
        
        return self._agent
    
    def query(self, question: str) -> Dict[str, Any]:
        """
        Execute a natural language query against the database.
        
        Args:
            question: Natural language question
            
        Returns:
            Dict with answer and query information
        """
        try:
            agent = self._get_agent()
            result = agent.invoke({"input": question})
            
            return {
                "success": True,
                "answer": result.get("output", "No result found."),
                "source": "database",
            }
            
        except Exception as e:
            error_message = str(e)
            
            # Handle common errors gracefully
            if "API key" in error_message:
                return {
                    "success": False,
                    "answer": "LLM API key is not configured. Please set up your API key.",
                    "error": error_message,
                }
            
            return {
                "success": False,
                "answer": f"I encountered an error while querying the database. Please try rephrasing your question.",
                "error": error_message,
            }
    
    def get_table_info(self) -> str:
        """Get information about available tables"""
        return self.db.get_table_info()
    
    def get_table_names(self) -> list:
        """Get list of table names"""
        return self.db.get_usable_table_names()
    
    def run_query(self, query: str) -> str:
        """
        Run a raw SQL query (SELECT only for safety).
        
        Args:
            query: SQL query string
            
        Returns:
            Query result as string
        """
        query = query.strip()
        if not query.upper().startswith("SELECT"):
            return "Error: Only SELECT queries are allowed."
        
        try:
            return self.db.run(query)
        except Exception as e:
            return f"Query error: {str(e)}"
