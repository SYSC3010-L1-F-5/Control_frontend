from lib.key import Key

class LibEvent:

    def __init__(self):
        return

    def is_exists(self, uuid):
        return True

    def details(self, uuid):
        return {
                "uuid": "123456",
                "device": "dasgfagafwerarytjre",
                "time": 1234567890,
                "type": "test",
                "details": "im a test",
                "hidden": 1
            }

    def device(self, key):
        return [
            {
                "uuid": "text",
                "device": "text",
                "time": 987654321,
                "type": "text",
                "details": "text",
                "hidden": 0
            },
            {
                "uuid": "123456",
                "device": "dasgfagafwerarytjre",
                "time": 1234567890,
                "type": "test",
                "details": "im a test",
                "hidden": 1
            }
        ]

    def uuid(self, details):
        return Key().uuid(details)

    def get_all_events(self):
        return [
            {
                "uuid": "text",
                "device": "text",
                "time": 987654321,
                "type": "text",
                "details": "text",
                "hidden": 0
            },
            {
                "uuid": "123456",
                "device": "dasgfagafwerarytjre",
                "time": 1234567890,
                "type": "test",
                "details": "im a test",
                "hidden": 1
            }
        ]

    def add_event(self, details):
        return self.uuid(";".join("{key}:{value}".format(key=key, value=value) for key, value in details.items()))

    def delete_event(self, uuid):
        return True

    def update_event(self, uuid, set):
        return True