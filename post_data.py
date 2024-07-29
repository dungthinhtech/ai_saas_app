import requests
import json

url = "https://www.dungthinh.com/api/webhooks/clerk"
data = {
    "data": {
        "birthday": "",
        "created_at": 1654012591514,
        "email_addresses": [
            {
                "email_address": "example@example.org",
                "id": "idn_29w83yL7CwVlJXylYLxcslromF1",
                "linked_to": [],
                "object": "email_address",
                "verification": {
                    "status": "verified",
                    "strategy": "ticket"
                }
            }
        ],
        "external_accounts": [],
        "external_id": "567772",
        "first_name": "Example",
        "gender": "",
        "id": "user_29w83sxmDNGwOuEthce5gg56FcC",
        "image_url": "https://img.clerk.com/xxxxxx",
        "last_name": "Example",
        "last_sign_in_at": 1654012591514,
        "object": "user",
        "password_enabled": True,
        "phone_numbers": [],
        "primary_email_address_id": "idn_29w83yL7CwVlJXylYLxcslromF1",
        "primary_phone_number_id": None,
        "primary_web3_wallet_id": None,
        "private_metadata": {},
        "profile_image_url": "https://www.gravatar.com/avatar?d=mp",
        "public_metadata": {},
        "two_factor_enabled": False,
        "unsafe_metadata": {},
        "updated_at": 1654012591835,
        "username": None,
        "web3_wallets": []
    },
    "object": "event",
    "type": "user.created"
}

headers = {
    "Content-Type": "application/json"
}

response = requests.post(url, data=json.dumps(data), headers=headers)

print(response.status_code)
print(response.json())
