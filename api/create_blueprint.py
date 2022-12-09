from flask import Blueprint

def blueprints(param):
    return Blueprint(
                param, 
                __name__,
                static_folder = "public",
                static_url_path = "/",
                template_folder = "templates")