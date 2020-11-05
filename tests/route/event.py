import json
from flask_restful import Resource, reqparse, request

from lib.message import response

from lib.libdevice import LibDevice
LIBDEVICE = LibDevice()

from lib.libevent import LibEvent
LIBEVENT = LibEvent()

from lib.libuser import LibUser
LIBUSER = LibUser()

PARASER = reqparse.RequestParser()

class Event(Resource):

    def __init__(self):
        """

            self.database: connects to event table in the database
            self.who: device key
            self.what: event details
            self.when: unix timestamp
            self.uuid: evnet uuid
            self.hidden: 0 for not hidden, 1 for hidden
            self.auth_uuid: use for authentication
            self.auth_otp: use for authentication

        """
        self.who = None
        self.what = None
        self.when = None
        self.uuid = None
        self.hidden = 0
        self.auth_uuid = None
        self.auth_otp = None

    @response
    def get(self, uuid=None):
        """

            This method provides all event details
            to frontend in ascending order

            Args:
                self: access global variables
                uuid: event uuid

            Returns:
                list: event list
                int: status code

        """

        # check url
        urls = [
            "/events",
            "/event/{uuid}".format(uuid=uuid)
        ]
        path = request.path
        if path not in urls:
            return "Incorrect HTTP Method", 400

        PARASER.add_argument('X-UUID', type=str, location='headers', help='User UUID')
        PARASER.add_argument('X-OTP', type=str, location='headers', help='User OTP')
        args = PARASER.parse_args(strict=True)
        self.auth_uuid = args["X-UUID"]
        self.auth_otp = args["X-OTP"]

        if LIBUSER.check_otp(uuid=self.auth_uuid, otp=self.auth_otp) is False:
            # /events
            if path.split("/")[1] == "events":

                events = LIBEVENT.get_all_events()
                if events is not None:
                    for item in events:
                        item["device"] = LIBDEVICE.details(item["device"])
                        if item["device"] is not None:
                            item["device"].pop("key")

                return events, 200
            
            # /event/<uuid>
            if path.split("/")[2] == uuid:
                details = LIBEVENT.details(uuid)
                if details is not None:
                    details["device"] = LIBDEVICE.details(details["device"])
                    # Hide the key
                    details["device"]["key"] = ""
                    return details, 200
                else:
                    return "Event not found", 404
        
            return "", 404

        else:
            return "You are unauthorized", 401

    @response
    def post(self):
        """
        
            This method is used by flask restful to 
            provide api access

            Args:
                self: access global variables
            
            Returns:
                string: uuid to identify event
                int: status code
        
        """

        # check url
        urls = [
            "/event/add"
        ]
        path = request.path
        if path not in urls:
            return "Incorrect HTTP Method", 400

        if path.split("/")[2] != "add":
            return "", 404

        PARASER.add_argument('who', type=str, help='Device Access Key')
        PARASER.add_argument('what', type=str, help='Event details in json')
        PARASER.add_argument('when', type=int, help='Unix Timestamp')
        args = PARASER.parse_args(strict=True)

        self.who = args["who"]
        self.what = args["what"]
        self.when = args["when"]

        if self.__is_empty_or_none(self.who, self.what, self.when) is False:

            self.what = json.loads(self.what.replace("'", '"'))
            self.when = int(args["when"])

            if self.what["type"] == ("temperature" or "humidity" or "pressure"):
                try:
                    int(self.what["data"])
                except Exception as e:
                    return str(e), 400
                    
            is_exists = LIBDEVICE.is_exists(self.who)

            if is_exists is False:
                return "Who are you?", 404
            else:
                event = {
                    "device": self.who,
                    "type": self.what["type"],
                    "details": str(self.what["data"]),
                    "time": self.when
                }

                self.uuid = LIBEVENT.add_event(event)

            if self.uuid is not None:
                PLUGIN.on(event=event)
                EMAIL.send(event=event)
                return self.uuid, 200
            else:
                return "Duplicated event", 403
        else:
            return "The request has unfulfilled fields", 400

    @response
    def delete(self):
        """
        
            This method deletes specific event

            Args:
                self: access global variables
            
            Returns:
                string: deleted or not
                int: status code
        
        """
        # check url
        urls = [
            "/event/delete"
        ]
        path = request.path
        if path not in urls:
            return "Incorrect HTTP Method", 400

        if path.split("/")[2] != "delete":
            return "", 404

        PARASER.add_argument('which', type=str, help='Event UUID')
        PARASER.add_argument('X-UUID', type=str, location='headers', help='User UUID')
        PARASER.add_argument('X-OTP', type=str, location='headers', help='User OTP')
        args = PARASER.parse_args(strict=True)

        self.auth_uuid = args["X-UUID"]
        self.auth_otp = args["X-OTP"]

        if LIBUSER.check_otp(uuid=self.auth_uuid, otp=self.auth_otp) is False:
            if LIBUSER.is_admin(self.auth_uuid):
                if args["which"] is not None and args["which"] != "": 
                    self.uuid = args["which"]
                    is_deleted = LIBEVENT.delete_event(self.uuid)

                    if is_deleted is True:
                        return "Event is deleted", 200
                    else:
                        return "Event not found", 404
                else:
                    return "The request has unfulfilled fields", 400
            else:
                return "You don't have this permission", 403
        else:
            return "You are unauthorized", 401

    @response
    def put(self):
        """
        
            This method updates specfic event

            TODO:
                - need a better way to update event

            Args:
                self: access global variables
                uuid: event uuid
            
            Returns:
                string: updated or not
                int: status code
        
        """
        # check url
        urls = [
            "/event/clear",
            "/event/update"
        ]
        path = request.path
        if path not in urls:
            return "Incorrect HTTP Method", 400

        path =  path.split("/")[2]
        if path != "update" and path != "clear":
            return "", 404

        # /event/clear
        if path == "clear":
            PARASER.add_argument('X-UUID', type=str, location='headers', help='User UUID')
            PARASER.add_argument('X-OTP', type=str, location='headers', help='User OTP')
            args = PARASER.parse_args(strict=True)

            # /event/update
            self.auth_uuid = args["X-UUID"]
            self.auth_otp = args["X-OTP"]

            if LIBUSER.check_otp(uuid=self.auth_uuid, otp=self.auth_otp) is False:
                PLUGIN.off()
                return "OK", 200
            else:
                return "You are unauthorized", 401

        if path == "update":
            PARASER.add_argument('which', type=str, help='Event UUID')
            PARASER.add_argument('fields', type=str, help='Fields to be updated')
            PARASER.add_argument('X-UUID', type=str, location='headers', help='User UUID')
            PARASER.add_argument('X-OTP', type=str, location='headers', help='User OTP')
            args = PARASER.parse_args(strict=True)

            # /event/update
            self.auth_uuid = args["X-UUID"]
            self.auth_otp = args["X-OTP"]

            if LIBUSER.check_otp(uuid=self.auth_uuid, otp=self.auth_otp) is False:
                if LIBUSER.is_admin(self.auth_uuid):
                    if args["which"] is not None and args["which"] != "": 
                        self.uuid = args["which"]

                        status = LIBEVENT.is_exists(self.uuid)

                        if status is True:
                            if args["fields"] is not None and args["fields"] != "":
                                fields = json.loads(args["fields"].replace("'", '"'))
                                
                                if "hidden" in fields:
                                    self.hidden = fields["hidden"]
                                    set = {
                                        "name": "hidden",
                                        "value": self.hidden,
                                        "skip": False
                                    }
                                    LIBEVENT.update_event(self.uuid, set)

                                if "what" in fields:
                                    if self.__is_empty_or_none(fields["what"]) is False:
                                        self.what = fields["what"]
                                        set = {
                                            "name": "details",
                                            "value": self.what,
                                            "skip": False
                                        }
                                        LIBEVENT.update_event(self.uuid, set)
                                    else:
                                        return "The request has unfulfilled fields", 401

                                # update event uuid
                                details = LIBEVENT.details(self.uuid)
                                event = {
                                    "device": details["device"],
                                    "type": details["type"],
                                    "details": details["details"],
                                    "time": details["time"]
                                }
                                uuid_field = ";".join("{key}:{value}".format(key=key, value=value) for key, value in event.items())
                                old_uuid = self.uuid
                                self.uuid = LIBEVENT.uuid(uuid_field)
                                set = {
                                    "name": "uuid",
                                    "value": self.uuid,
                                    "skip": True
                                }
                                LIBEVENT.update_event(old_uuid, set)
                            else:
                                return "Event is not updated", 400

                            return self.uuid, 200
                        else:
                            return "Event not found", 404
                    else:
                        return "The request has unfulfilled fields", 400
                else:
                    return "You don't have this permission", 403
            else:
                return "You are unauthorized", 401
        
    def __is_empty_or_none(self, *argv):
        """

            Check if there is a empty or None in the args

            Args:
                self: access global variables
                *argv: argument(s) to check if is None or "" or " " with spaces
            
            Returns:
                bool: True if exists, False otherwise

        """
        is_exists = True

        for arg in argv:
            if arg is None:
                is_exists = True
                break
            elif str(arg).replace(" ", "") == "":
                is_exists = True
                break
            else:
                is_exists = False
        
        return is_exists