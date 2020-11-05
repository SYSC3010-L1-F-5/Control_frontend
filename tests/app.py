# flask run --no-debugger --host=0.0.0.0 --port=6000

from flask import Flask, jsonify, make_response
from flask_restful import Api
from flask_cors import CORS
from route.config import Config
from route.device import Device
from route.event import Event
from route.user import User

APP = Flask(__name__)
CORS(APP)
API = Api(APP)

API.add_resource(Config, '/config')
API.add_resource(Device, 
    '/device/add',
    '/device/delete',
    "/device/update",
    "/device/<key>",
    "/devices",
    "/pulse"
)
API.add_resource(User, 
    '/user/login',
    '/user/add',
    '/user/delete',
    '/user/update',
    '/user/logout',
    '/user/<uuid>',
    '/user',
    '/users'
)
API.add_resource(Event, 
    "/events",
    "/event/add",
    "/event/delete",
    "/event/update",
    "/event/clear",
    "/event/<uuid>"
)

if __name__ == '__main__':
    APP.run()
  