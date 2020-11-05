from lib.key import Key

class LibDevice:

    def __init__(self):
        return

    def is_exists(self, key):
        return True

    def details(self, key):
        return {
            "ip": "213.123.212.123",
            "port": 44,
            "zone": "text",
            "type": "text",
            "name": "text",
            "uuid": "text",
            "key": "text",
            "pulse": "1234567890",
            "is_enabled": 1
        }
    
    def uuid(self, details):
        return Key().uuid(details)

    def get_all_devices(self):
        return [
            {
                "ip": "213.123.212.123",
                "port": 44,
                "zone": "text",
                "type": "text",
                "name": "text",
                "uuid": "text",
                "key": "text",
                "pulse": "1234567890",
                "is_enabled": 1
            },{
                "ip": "1.1.1.1",
                "port": 99,
                "zone": "test",
                "type": "test",
                "name": "test",
                "uuid": "test",
                "key": "test",
                "pulse": "987654321",
                "is_enabled": 0
            }
        ]

    def add_device(self, details):
        return Key().generate()

    def delete_device(self, key):
        return True

    def update_device(self, key, set):
        return True
        