import requests
import time

BASE_URL = 'http://127.0.0.1:5000/api/v1'

def test_system_flow():
    print("🚀 Iniciando prueba de vida del sistema Spectralab...")
    
    # 1. Crear una Empresa
    print("\n🏢 1. Registrando Empresa (Laboratorios Clinicos S.A.)...")
    company_data = {
        "name": "Laboratorios Clinicos S.A.",
        "tax_id": "20123456789",
        "contact_email": "admin@labclinicos.com",
        "contact_phone": "+51 987654321"
    }
    
    comp_response = requests.post(f"{BASE_URL}/companies/", json=company_data)
    
    if comp_response.status_code == 201:
        company_id = comp_response.json()['id']
        print(f"✅ Empresa creada con éxito. ID: {company_id}")
        
        # Pausa pequeña para apreciar el log
        time.sleep(1)
        
        # 2. Crear el Gemelo Digital (Activo)
        print("\n🔬 2. Registrando Gemelo Digital del Activo...")
        asset_data = {
            "company_id": company_id,
            "brand": "Mindray",
            "model": "BS-240",
            "serial_number": "MRY-2023-8899",
            "internal_code": "EQ-001",
            "status": "Operativo"
        }
        
        asset_response = requests.post(f"{BASE_URL}/assets/", json=asset_data)
        
        if asset_response.status_code == 201:
            asset_info = asset_response.json()
            print("✅ ¡Activo registrado con éxito en la base de datos!")
            print(f"   🔹 ID: {asset_info['id']}")
            print(f"   🔹 Marca/Modelo: {asset_info['brand']} {asset_info['model']}")
            print(f"   🔹 Estado: {asset_info['status']}")
            print("\n🎉 El flujo principal del Backend está funcionando perfectamente.")
        else:
            print("❌ Error al crear el activo:", asset_response.text)
            
    else:
        print("❌ Error al crear la empresa:", comp_response.text)

if __name__ == '__main__':
    # Ejecuta el script
    test_system_flow()