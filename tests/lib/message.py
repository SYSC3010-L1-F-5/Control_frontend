from functools import wraps
import time
import re

MESSAGES = {
    "200": "HTTP 200 OK",
    "400": "HTTP Bad Request",
    "401": "HTTP Unauthorized",
    "403": "Forbidden",
    "404": "HTTP Not Found",
    "500": "Internal Server Error"
}


def response(func):
    """

        Changes the message to fit the structure
            Args:
                self: access global variables
            func: decoration call

        Returns:
            json: message to response

    """

    @wraps(func)
    def wrapper(*args, **kwargs):
        try:
            original, status_code = func(*args, **kwargs)
            result = {
                "message": __message(status_code, original),
                "status_code": status_code,
                "time": int(time.time() * 1000)
            }
            return result, status_code
        except Exception as e:
            result = {
                "message": __message(500, str(e)),
                "status_code": 500,
                    "time": int(time.time() * 1000)
            }
            return result, 500
    return wrapper

def errorhandler(status_code):
    """

        Response proper error formate

        Args:
            self: access global variables
            status_code: status code

        Returns:
            str: error message

    """

    result = {
        "message": __message(status_code, ""),
        "status_code": status_code,
        "time": int(time.time() * 1000)
        }
    return result

def __message(code, message):
    """

        Returns proper message body

        Args:
           self: access global variables
            code: status code
            message: to override message body

        Returns:
            str: new message body

    """

    if message == "":
        message = MESSAGES[str(code)]
    return message
