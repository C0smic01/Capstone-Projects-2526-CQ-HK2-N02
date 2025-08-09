from .CompilerService import CompilerService
import subprocess
import os
from ...utils.error_codes import ERROR_CODES

STATUS_CODE_FIELD="status"
SUCCESS_FIELD="success"
MESSAGE_FIELD="message"

SUCCESS_CODE=200
COMPILE_CODE=ERROR_CODES["COMPILATION_ERROR"]
TIMED_OUT_COMPILE_CODE=ERROR_CODES["COMPILE_TIMED_OUT_ERROR"]
INTERNAL_CODE=ERROR_CODES["UNKNOWN_ERROR"]


class CplusplusCompiler(CompilerService):
    LIMIT_TIME_OUT=15
    
    def compiler_response_factory(self,status_code,success,msg):
        return {
            STATUS_CODE_FIELD:status_code,
            SUCCESS_FIELD:success,
            MESSAGE_FIELD:msg
        }

    def clean_compile_error_message(self,file_path, message):
        cleaned_message = message.replace(file_path, os.path.basename(file_path))
        return cleaned_message

    def compile(self,file_path):
        if not os.path.isfile(file_path):
            raise FileNotFoundError(f"File not found: {file_path}")

        # Output executable path (same folder, named 'main.exe' on Windows or 'main' on Unix)
        output_file = os.path.join(os.path.dirname(file_path), 'main.exe' if os.name == 'nt' else 'main')

        try:
            result = subprocess.run(
                ["g++", file_path, "-o", output_file],
                stdout=subprocess.PIPE,
                stderr=subprocess.PIPE,
                text=True,
                timeout=self.TIME_OUT
            )
            if result.returncode == 0:
                COMPILE_SUCCESS_MSG="Compilation successful"
                return self.compiler_response_factory(200,True,COMPILE_SUCCESS_MSG)
            else:
                return self.compiler_response_factory(400,False,self.clean_compile_error_message(file_path,result.stderr))
        except subprocess.TimeoutExpired:
            COMPILE_TIMED_OUT_ERROR="Compilation timed out"
            return self.compiler_response_factory(500,False,COMPILE_TIMED_OUT_ERROR)
        except Exception as e:
            unknown_exception_msg=f"Unexpected error: {str(e)}"
            return self.compiler_response_factory(500,False,unknown_exception_msg)