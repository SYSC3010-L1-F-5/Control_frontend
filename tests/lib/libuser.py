import time

from lib.key import Key
from lib.libconfig import LibConfig
CONFIG = LibConfig().fetch()

class LibUser:

    def __init__(self):
        return

    def add_user(self, details, user_type):
        return True

    def delete_user(self, uuid):
        return True
        
    def is_exists(self, uuid):
        return True
    
    def get_otp(self, uuid, permanent=False):
        return Key().generate()
    
    def check_otp(self, uuid, otp):
        return False

    def otp_to_expire(self, uuid):
        return True

    def details(self, uuid):
        return {
            "uuid": "text",
            "username": "text",
            "password": "text",
            "email": "text",
            "type": "admin",
            "otp": "text",
            "otp_time": -1,
            "last_login": "1234567890"
        }

    def update_user(self, uuid, set):
        return True
        
    def uuid(self, details):
        return Key().sha256(details)

    def is_admin(self, uuid):
        return True

    def get_all_users(self):
         return [
             {
                "uuid": "test",
                "username": "test",
                "password": "text",
                "email": "text",
                "type": "admin",
                "otp": "text",
                "otp_time": -1,
                "last_login": 1234567890
            },{
                "uuid": "admin",
                "username": "text",
                "password": "text",
                "email": "text",
                "type": "regular",
                "otp": "text",
                "otp_time": 0,
                "last_login": 987654321 
            }
         ]