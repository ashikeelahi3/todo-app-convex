import pandas as pd
import requests
import os
# import uuid
from dotenv import load_dotenv

load_dotenv('./.env.local')

# Convex configuration
CONVEX_URL = os.getenv('CONVEX_URL')

user_id = "ashik123"
title = "This is a todo"
description = "This is a another todo"
is_completed = False

todo = {
  "user_id": user_id,
  "title": title,
  "description": description,
  "is_completed": is_completed
}

# print(todo)
# print(type(todo))

payload = {
  "path": "todoFunc:saveTodo",
  "args": todo,
  "format": "json"
}
    
response = requests.post(f"{CONVEX_URL}/api/mutation", json=payload)

if response.status_code == 200:
  print("Successfully inserted...")
else:
  print("Something went wrong... \n Status code:", response.status_code)  