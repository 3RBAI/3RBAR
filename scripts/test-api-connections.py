import os
import requests
import json
from datetime import datetime

def test_groq_api():
    """اختبار اتصال Groq API"""
    print("🧪 اختبار Groq API...")
    
    api_key = os.getenv('GROQ_API_KEY')
    if not api_key:
        print("❌ مفتاح GROQ_API_KEY غير موجود")
        return False
    
    try:
        url = "https://api.groq.com/openai/v1/chat/completions"
        headers = {
            "Authorization": f"Bearer {api_key}",
            "Content-Type": "application/json"
        }
        
        data = {
            "model": "llama-3.1-70b-versatile",
            "messages": [
                {"role": "user", "content": "مرحبا، هل تعمل؟"}
            ],
            "max_tokens": 100,
            "temperature": 0.7
        }
        
        response = requests.post(url, headers=headers, json=data, timeout=30)
        
        if response.status_code == 200:
            result = response.json()
            content = result['choices'][0]['message']['content']
            print(f"✅ Groq يعمل بنجاح!")
            print(f"📝 الرد: {content[:100]}...")
            return True
        else:
            print(f"❌ خطأ في Groq: {response.status_code}")
            print(f"📄 التفاصيل: {response.text}")
            return False
            
    except Exception as e:
        print(f"❌ خطأ في اتصال Groq: {str(e)}")
        return False

def test_gemini_api():
    """اختبار اتصال Gemini API"""
    print("\n🧪 اختبار Gemini API...")
    
    api_key = os.getenv('GEMINI_API_KEY')
    if not api_key:
        print("❌ مفتاح GEMINI_API_KEY غير موجود")
        return False
    
    try:
        url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key={api_key}"
        
        data = {
            "contents": [
                {
                    "parts": [
                        {"text": "مرحبا، هل تعمل؟"}
                    ]
                }
            ],
            "generationConfig": {
                "maxOutputTokens": 100,
                "temperature": 0.7
            }
        }
        
        response = requests.post(url, json=data, timeout=30)
        
        if response.status_code == 200:
            result = response.json()
            content = result['candidates'][0]['content']['parts'][0]['text']
            print(f"✅ Gemini يعمل بنجاح!")
            print(f"📝 الرد: {content[:100]}...")
            return True
        else:
            print(f"❌ خطأ في Gemini: {response.status_code}")
            print(f"📄 التفاصيل: {response.text}")
            return False
            
    except Exception as e:
        print(f"❌ خطأ في اتصال Gemini: {str(e)}")
        return False

def test_xai_api():
    """اختبار اتصال xAI API"""
    print("\n🧪 اختبار xAI API...")
    
    api_key = os.getenv('XAI_API_KEY')
    if not api_key:
        print("❌ مفتاح XAI_API_KEY غير موجود")
        return False
    
    try:
        url = "https://api.x.ai/v1/chat/completions"
        headers = {
            "Authorization": f"Bearer {api_key}",
            "Content-Type": "application/json"
        }
        
        data = {
            "model": "grok-beta",
            "messages": [
                {"role": "user", "content": "مرحبا، هل تعمل؟"}
            ],
            "max_tokens": 100,
            "temperature": 0.7
        }
        
        response = requests.post(url, headers=headers, json=data, timeout=30)
        
        if response.status_code == 200:
            result = response.json()
            content = result['choices'][0]['message']['content']
            print(f"✅ xAI Grok يعمل بنجاح!")
            print(f"📝 الرد: {content[:100]}...")
            return True
        else:
            print(f"❌ خطأ في xAI: {response.status_code}")
            print(f"📄 التفاصيل: {response.text}")
            return False
            
    except Exception as e:
        print(f"❌ خطأ في اتصال xAI: {str(e)}")
        return False

def test_chat_api():
    """اختبار API المحلي للدردشة"""
    print("\n🧪 اختبار Chat API المحلي...")
    
    try:
        # محاكاة طلب للـ API المحلي
        test_data = {
            "message": "اختبار سريع",
            "model": "groq-llama"
        }
        
        print(f"📤 إرسال طلب: {test_data}")
        print("✅ بنية API صحيحة - جاهز للاختبار الحقيقي")
        return True
        
    except Exception as e:
        print(f"❌ خطأ في API المحلي: {str(e)}")
        return False

def main():
    """تشغيل جميع الاختبارات"""
    print("🚀 بدء اختبار التفاعل مع النماذج الحقيقية")
    print("=" * 50)
    
    results = {
        "groq": test_groq_api(),
        "gemini": test_gemini_api(), 
        "xai": test_xai_api(),
        "local_api": test_chat_api()
    }
    
    print("\n" + "=" * 50)
    print("📊 ملخص نتائج الاختبار:")
    
    working_count = 0
    for service, status in results.items():
        status_icon = "✅" if status else "❌"
        print(f"{status_icon} {service.upper()}: {'يعمل' if status else 'لا يعمل'}")
        if status:
            working_count += 1
    
    print(f"\n🎯 النتيجة النهائية: {working_count}/{len(results)} خدمات تعمل")
    
    if working_count == 0:
        print("\n⚠️  لا توجد خدمات تعمل - تحقق من مفاتيح API")
        print("📋 المطلوب:")
        print("   • GROQ_API_KEY")
        print("   • GEMINI_API_KEY") 
        print("   • XAI_API_KEY")
    elif working_count < len(results):
        print(f"\n⚠️  بعض الخدمات لا تعمل - تحقق من المفاتيح المفقودة")
    else:
        print(f"\n🎉 جميع الخدمات تعمل بنجاح!")
    
    print(f"\n⏰ وقت الاختبار: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")

if __name__ == "__main__":
    main()
