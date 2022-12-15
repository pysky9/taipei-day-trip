import re

def data_validate(email, password, name = None):
    email_regex = r'([A-Za-z0-9]+[.-_])*[A-Za-z0-9]+@[A-Za-z0-9-]+(\.[A-Z|a-z]{2,})+'
    password_regex = r'[A-Za-z0-9@#$%^&+=]{3,}'
    email_match = re.match(email_regex, email)
    password_match = re.match(password_regex, password)
    if name or name == "":
        name_regex = r'[A-Za-z]{2,25}( [A-Za-z]{2,25})?'
        name_match = re.match(name_regex, name)
        if not name_match:
            return {"error": True, "message": "姓名格式錯誤"}
    
    if not email_match:
        return {"error": True, "message": "email格式錯誤"}
    
    elif not password_match:
        return {"error": True, "message": "密碼格式錯誤"}

    return {"error": False, "message": "資料正確"}