from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import subprocess
import sys
import io
import logging
import openai
import os
from dotenv import load_dotenv
import tempfile
from pathlib import Path

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Set your OpenAI API key
load_dotenv()
openai.api_key = os.getenv("OPENAI_API_KEY")

app = FastAPI()

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class CodeRequest(BaseModel):
    code: str
    language: str

SUPPORTED_LANGUAGES = {
    "python": {
        "extension": "py",
        "command": "python",
        "template": "print('Hello, World!')"
    },
    "javascript": {
        "extension": "js",
        "command": "node",
        "template": "console.log('Hello, World!');"
    },
    "java": {
        "extension": "java",
        "command": "java",
        "template": """
public class Main {
    public static void main(String[] args) {
        System.out.println("Hello, World!");
    }
}"""
    },
    "cpp": {
        "extension": "cpp",
        "command": "g++",
        "template": """
#include <iostream>
int main() {
    std::cout << "Hello, World!" << std::endl;
    return 0;
}"""
    },
    "csharp": {
        "extension": "cs",
        "command": "dotnet",
        "template": """
using System;
class Program {
    static void Main() {
        Console.WriteLine("Hello, World!");
    }
}"""
    },
    "php": {
        "extension": "php",
        "command": "php",
    },
    "ruby": {
        "extension": "rb",
        "command": "ruby",
    },
    "swift": {
        "extension": "swift",
        "command": "swift",
    },
    "go": {
        "extension": "go",
        "command": "go run",
    },
    "rust": {
        "extension": "rs",
        "command": "rustc",
    },
    "kotlin": {
        "extension": "kt",
        "command": "kotlin",
    },
    "typescript": {
        "extension": "ts",
        "command": "ts-node",
    },
    "r": {
        "extension": "r",
        "command": "Rscript",
    },
    "scala": {
        "extension": "scala",
        "command": "scala",
    },
    "perl": {
        "extension": "pl",
        "command": "perl",
    },
    "haskell": {
        "extension": "hs",
        "command": "ghc",
    },
    "lua": {
        "extension": "lua",
        "command": "lua",
    },
    "sql": {
        "extension": "sql",
        "command": "sqlite3",
    },
    "bash": {
        "extension": "sh",
        "command": "bash",
    },
    "powershell": {
        "extension": "ps1",
        "command": "pwsh",
    }
}

def create_temp_file(code: str, extension: str) -> str:
    """Create a temporary file with the given code and extension."""
    temp_dir = tempfile.mkdtemp()
    file_path = os.path.join(temp_dir, f"main.{extension}")
    with open(file_path, "w") as f:
        f.write(code)
    return file_path

def compile_and_run(file_path: str, language: str) -> tuple[str, str]:
    """Compile (if needed) and run the code file."""
    lang_config = SUPPORTED_LANGUAGES[language]
    command = lang_config["command"]
    
    try:
        if language == "python":
            process = subprocess.run(
                [command, file_path],
                capture_output=True,
                text=True,
                timeout=10
            )
        
        elif language == "javascript":
            process = subprocess.run(
                [command, file_path],
                capture_output=True,
                text=True,
                timeout=10
            )
            
        elif language == "java":
            # Compile Java
            compile_process = subprocess.run(
                ["javac", file_path],
                capture_output=True,
                text=True,
                timeout=10
            )
            if compile_process.returncode != 0:
                return "", compile_process.stderr
                
            # Run Java
            process = subprocess.run(
                ["java", "-cp", os.path.dirname(file_path), "Main"],
                capture_output=True,
                text=True,
                timeout=10
            )
            
        elif language == "cpp":
            # Compile C++
            output_path = os.path.join(os.path.dirname(file_path), "a.out")
            compile_process = subprocess.run(
                ["g++", file_path, "-o", output_path],
                capture_output=True,
                text=True,
                timeout=10
            )
            if compile_process.returncode != 0:
                return "", compile_process.stderr
                
            # Run C++
            process = subprocess.run(
                [output_path],
                capture_output=True,
                text=True,
                timeout=10
            )
            
        elif language == "csharp":
            # Run C# using dotnet script
            process = subprocess.run(
                ["dotnet", "script", file_path],
                capture_output=True,
                text=True,
                timeout=10
            )
            
        else:
            return "", f"Language {language} execution not yet implemented"

        return process.stdout, process.stderr

    except subprocess.TimeoutExpired:
        return "", "Execution timed out"
    except Exception as e:
        return "", f"Error executing code: {str(e)}"

@app.get("/")
async def root():
    return {"message": "Server is running"}  # Return valid JSON response

@app.post("/execute")
async def execute_code(request: dict):
    try:
        code = request.get("code", "")
        language = request.get("language", "python").lower()
        
        # Create a temporary file
        with tempfile.NamedTemporaryFile(mode='w', suffix=f'.{language}', delete=False) as f:
            f.write(code)
            temp_file = f.name
        
        try:
            if language == "python":
                # Execute Python code
                result = subprocess.run(['python', temp_file], 
                                     capture_output=True, 
                                     text=True, 
                                     timeout=10)
                return {
                    "output": result.stdout,
                    "error": result.stderr
                }
            elif language == "javascript":
                # Execute JavaScript code using Node.js
                result = subprocess.run(['node', temp_file], 
                                     capture_output=True, 
                                     text=True, 
                                     timeout=10)
                return {
                    "output": result.stdout,
                    "error": result.stderr
                }
            else:
                return {
                    "output": "",
                    "error": f"Language {language} is not supported yet."
                }
        finally:
            # Clean up the temporary file
            os.unlink(temp_file)
            
    except Exception as e:
        logger.error(f"Error executing code: {str(e)}")
        return {"error": str(e)}

@app.post("/analyze")
async def analyze_code(request: dict):
    try:
        code = request.get("code", "")
        language = request.get("language", "python")
        
        # Simple code analysis
        analysis = {
            "suggestions": "Consider adding comments to explain your code.",
            "issues": "No major issues found.",
            "best_practices": "Your code follows basic best practices."
        }
        
        # Add language-specific analysis
        if language == "python":
            if "print" in code:
                analysis["suggestions"] += "\nConsider using logging for better debugging."
            if "import" not in code:
                analysis["suggestions"] += "\nConsider organizing your code into modules."
                
        elif language == "javascript":
            if "console.log" in code:
                analysis["suggestions"] += "\nConsider using proper error handling."
            if "var" in code:
                analysis["suggestions"] += "\nConsider using 'let' or 'const' instead of 'var'."
        
        return {"analysis": analysis}
        
    except Exception as e:
        logger.error(f"Analysis error: {str(e)}")
        return {"error": str(e)}

@app.post("/chat")
async def chat(request: dict):
    try:
        message = request.get("message", "")
        
        # Call OpenAI API
        response = await openai.ChatCompletion.acreate(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": """You are a helpful AI programming assistant. You can:
                 1. Help with coding questions
                 2. Debug code
                 3. Explain programming concepts
                 4. Suggest improvements
                 5. Provide code examples
                 Be concise but thorough in your responses."""},
                {"role": "user", "content": message}
            ],
            max_tokens=500,
            temperature=0.7
        )
        
        # Extract the AI's response
        ai_response = response.choices[0].message.content
        return {"response": ai_response}
            
    except Exception as e:
        return {"error": str(e)}

# Add this at the end of the file
if __name__ == "__main__":
    import uvicorn
    logger.info("Starting server...")
    uvicorn.run(app, host="127.0.0.1", port=8080) 