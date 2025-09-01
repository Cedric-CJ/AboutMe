#!/usr/bin/env python3
"""
Backend API Tests for Shop Application
Tests all backend endpoints according to the review request.
"""

import requests
import json
import uuid
from datetime import datetime
import os
import sys

# Get backend URL from frontend .env file
def get_backend_url():
    try:
        with open('/app/frontend/.env', 'r') as f:
            for line in f:
                if line.startswith('REACT_APP_BACKEND_URL='):
                    return line.split('=', 1)[1].strip()
    except Exception as e:
        print(f"Error reading frontend .env: {e}")
        return None
    return None

BASE_URL = get_backend_url()
if not BASE_URL:
    print("ERROR: Could not find REACT_APP_BACKEND_URL in frontend/.env")
    sys.exit(1)

API_URL = f"{BASE_URL}/api"
print(f"Testing backend at: {API_URL}")

class TestResults:
    def __init__(self):
        self.results = []
        self.passed = 0
        self.failed = 0
    
    def add_result(self, test_name, passed, details=""):
        self.results.append({
            'test': test_name,
            'passed': passed,
            'details': details
        })
        if passed:
            self.passed += 1
        else:
            self.failed += 1
        
        status = "✅ PASS" if passed else "❌ FAIL"
        print(f"{status}: {test_name}")
        if details:
            print(f"   Details: {details}")
    
    def summary(self):
        print(f"\n{'='*60}")
        print(f"TEST SUMMARY: {self.passed} passed, {self.failed} failed")
        print(f"{'='*60}")
        for result in self.results:
            status = "✅" if result['passed'] else "❌"
            print(f"{status} {result['test']}")
            if result['details'] and not result['passed']:
                print(f"   {result['details']}")

def test_hello_world(results):
    """Test GET /api/ returns status 200 and {message: "Hello World"}"""
    try:
        response = requests.get(f"{API_URL}/", timeout=10)
        
        if response.status_code == 200:
            data = response.json()
            if data.get('message') == 'Hello World':
                results.add_result("GET /api/ Hello World", True)
                return True
            else:
                results.add_result("GET /api/ Hello World", False, f"Wrong message: {data}")
                return False
        else:
            results.add_result("GET /api/ Hello World", False, f"Status {response.status_code}: {response.text}")
            return False
    except Exception as e:
        results.add_result("GET /api/ Hello World", False, f"Exception: {str(e)}")
        return False

def test_products_crud(results):
    """Test Products CRUD operations"""
    
    # Test data
    product_data = {
        "title": "Test Gaming Headset",
        "description": "High-quality wireless gaming headset with noise cancellation",
        "price_cents": 15999,
        "currency": "EUR",
        "tags": ["gaming", "audio", "wireless"],
        "active": True
    }
    
    created_product_id = None
    
    # 1. POST /api/products - Create product
    try:
        response = requests.post(f"{API_URL}/products", json=product_data, timeout=10)
        
        if response.status_code == 200:
            data = response.json()
            if 'id' in data and data['title'] == product_data['title']:
                created_product_id = data['id']
                results.add_result("POST /api/products (Create)", True, f"Created product with ID: {created_product_id}")
            else:
                results.add_result("POST /api/products (Create)", False, f"Missing ID or wrong data: {data}")
                return False
        else:
            results.add_result("POST /api/products (Create)", False, f"Status {response.status_code}: {response.text}")
            return False
    except Exception as e:
        results.add_result("POST /api/products (Create)", False, f"Exception: {str(e)}")
        return False
    
    # 2. GET /api/products - List products
    try:
        response = requests.get(f"{API_URL}/products", timeout=10)
        
        if response.status_code == 200:
            data = response.json()
            if isinstance(data, list):
                # Check if our created product is in the list
                found = any(p.get('id') == created_product_id for p in data)
                if found:
                    results.add_result("GET /api/products (List)", True, f"Found {len(data)} products including our test product")
                else:
                    results.add_result("GET /api/products (List)", False, "Created product not found in list")
            else:
                results.add_result("GET /api/products (List)", False, f"Expected list, got: {type(data)}")
        else:
            results.add_result("GET /api/products (List)", False, f"Status {response.status_code}: {response.text}")
    except Exception as e:
        results.add_result("GET /api/products (List)", False, f"Exception: {str(e)}")
    
    # 3. GET /api/products with query - Search by title
    try:
        response = requests.get(f"{API_URL}/products?q=Gaming", timeout=10)
        
        if response.status_code == 200:
            data = response.json()
            if isinstance(data, list):
                found = any('gaming' in p.get('title', '').lower() or 'gaming' in p.get('tags', []) for p in data)
                if found:
                    results.add_result("GET /api/products (Query by title)", True, f"Query returned {len(data)} products")
                else:
                    results.add_result("GET /api/products (Query by title)", False, "No gaming products found in query")
            else:
                results.add_result("GET /api/products (Query by title)", False, f"Expected list, got: {type(data)}")
        else:
            results.add_result("GET /api/products (Query by title)", False, f"Status {response.status_code}: {response.text}")
    except Exception as e:
        results.add_result("GET /api/products (Query by title)", False, f"Exception: {str(e)}")
    
    # 4. GET /api/products/{id} - Get specific product
    if created_product_id:
        try:
            response = requests.get(f"{API_URL}/products/{created_product_id}", timeout=10)
            
            if response.status_code == 200:
                data = response.json()
                if data.get('id') == created_product_id and data.get('title') == product_data['title']:
                    results.add_result("GET /api/products/{id} (Get specific)", True)
                else:
                    results.add_result("GET /api/products/{id} (Get specific)", False, f"Wrong product data: {data}")
            else:
                results.add_result("GET /api/products/{id} (Get specific)", False, f"Status {response.status_code}: {response.text}")
        except Exception as e:
            results.add_result("GET /api/products/{id} (Get specific)", False, f"Exception: {str(e)}")
    
    # 5. PATCH /api/products/{id} - Update product title
    if created_product_id:
        try:
            update_data = {
                "title": "Updated Gaming Headset Pro",
                "description": product_data["description"],
                "price_cents": product_data["price_cents"],
                "currency": product_data["currency"],
                "tags": product_data["tags"],
                "active": product_data["active"]
            }
            response = requests.patch(f"{API_URL}/products/{created_product_id}", json=update_data, timeout=10)
            
            if response.status_code == 200:
                data = response.json()
                if data.get('title') == update_data['title']:
                    results.add_result("PATCH /api/products/{id} (Update)", True, "Title updated successfully")
                else:
                    results.add_result("PATCH /api/products/{id} (Update)", False, f"Title not updated: {data}")
            else:
                results.add_result("PATCH /api/products/{id} (Update)", False, f"Status {response.status_code}: {response.text}")
        except Exception as e:
            results.add_result("PATCH /api/products/{id} (Update)", False, f"Exception: {str(e)}")
    
    # 6. DELETE /api/products/{id} - Delete product
    if created_product_id:
        try:
            response = requests.delete(f"{API_URL}/products/{created_product_id}", timeout=10)
            
            if response.status_code == 200:
                data = response.json()
                if data.get('ok') is True:
                    results.add_result("DELETE /api/products/{id} (Delete)", True)
                else:
                    results.add_result("DELETE /api/products/{id} (Delete)", False, f"Expected {{'ok': True}}, got: {data}")
            else:
                results.add_result("DELETE /api/products/{id} (Delete)", False, f"Status {response.status_code}: {response.text}")
        except Exception as e:
            results.add_result("DELETE /api/products/{id} (Delete)", False, f"Exception: {str(e)}")

def test_checkout_session(results):
    """Test POST /api/checkout/session"""
    
    # First create a product to use in checkout
    product_data = {
        "title": "Checkout Test Product",
        "description": "Product for testing checkout",
        "price_cents": 2999,
        "currency": "EUR",
        "tags": ["test"],
        "active": True
    }
    
    try:
        # Create product
        response = requests.post(f"{API_URL}/products", json=product_data, timeout=10)
        if response.status_code != 200:
            results.add_result("POST /api/checkout/session", False, "Failed to create test product for checkout")
            return
        
        product_id = response.json()['id']
        
        # Test checkout session
        checkout_data = {
            "provider": "paypal",
            "items": [
                {
                    "product_id": product_id,
                    "qty": 2
                }
            ]
        }
        
        response = requests.post(f"{API_URL}/checkout/session", json=checkout_data, timeout=10)
        
        if response.status_code == 200:
            data = response.json()
            if 'order_id' in data:
                # Check if it indicates missing ADYEN_* configuration
                if 'status' in data and data['status'] == 'requires_configuration':
                    results.add_result("POST /api/checkout/session", True, f"Returns order_id and indicates missing ADYEN_* config: {data}")
                elif 'message' in data and 'Adyen' in data.get('message', ''):
                    results.add_result("POST /api/checkout/session", True, f"Returns order_id with Adyen message: {data}")
                else:
                    results.add_result("POST /api/checkout/session", True, f"Returns order_id: {data}")
            else:
                results.add_result("POST /api/checkout/session", False, f"Missing order_id in response: {data}")
        else:
            results.add_result("POST /api/checkout/session", False, f"Status {response.status_code}: {response.text}")
        
        # Clean up test product
        requests.delete(f"{API_URL}/products/{product_id}", timeout=10)
        
    except Exception as e:
        results.add_result("POST /api/checkout/session", False, f"Exception: {str(e)}")

def test_webhook(results):
    """Test POST /api/checkout/webhook"""
    
    try:
        webhook_data = {
            "event_type": "payment.completed",
            "order_id": str(uuid.uuid4()),
            "amount": 2999,
            "currency": "EUR",
            "timestamp": datetime.utcnow().isoformat()
        }
        
        response = requests.post(f"{API_URL}/checkout/webhook?provider=paypal", json=webhook_data, timeout=10)
        
        if response.status_code == 200:
            data = response.json()
            if data.get('ok') is True:
                results.add_result("POST /api/checkout/webhook", True)
            else:
                results.add_result("POST /api/checkout/webhook", False, f"Expected {{'ok': True}}, got: {data}")
        else:
            results.add_result("POST /api/checkout/webhook", False, f"Status {response.status_code}: {response.text}")
    except Exception as e:
        results.add_result("POST /api/checkout/webhook", False, f"Exception: {str(e)}")

def test_contact_post(results):
    """Test POST /api/contact"""
    
    try:
        contact_data = {
            "topic": "Product Inquiry",
            "name": "Alex Johnson",
            "email": "alex.johnson@example.com",
            "message": "I'm interested in your gaming headsets. Do you have any wireless models with active noise cancellation?"
        }
        
        response = requests.post(f"{API_URL}/contact", json=contact_data, timeout=10)
        
        if response.status_code == 200:
            data = response.json()
            if 'id' in data and data.get('name') == contact_data['name']:
                results.add_result("POST /api/contact", True, f"Created contact with ID: {data['id']}")
            else:
                results.add_result("POST /api/contact", False, f"Missing ID or wrong data: {data}")
        else:
            results.add_result("POST /api/contact", False, f"Status {response.status_code}: {response.text}")
    except Exception as e:
        results.add_result("POST /api/contact", False, f"Exception: {str(e)}")

def main():
    print("Starting Backend API Tests...")
    print(f"Backend URL: {API_URL}")
    print("="*60)
    
    results = TestResults()
    
    # Run all tests
    test_hello_world(results)
    test_products_crud(results)
    test_checkout_session(results)
    test_webhook(results)
    test_contact_post(results)
    
    # Print summary
    results.summary()
    
    return results.failed == 0

if __name__ == "__main__":
    success = main()
    sys.exit(0 if success else 1)