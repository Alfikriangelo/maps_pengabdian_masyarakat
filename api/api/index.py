from flask import Flask, request, jsonify, send_from_directory, current_app
from flask_cors import CORS
from werkzeug.utils import secure_filename
from datetime import datetime
import os
import json
import requests

app = Flask(__name__) 
CORS(app)
saved_file_data = {}

# link fikri 'C:/Users/Lakuna/OneDrive/Documents/GitHub/tubes_pbo_maps/uploads'
# link darell 'C:/Users/ryand/Documents/GitHub/tubes_pbo_maps/uploads'

UPLOAD_FOLDER = r'C:/Users/Nab/Documents/GitHub/maps_pengabdian_masyarakat/src/uploads'
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif'}
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def handle_error(e):
    return jsonify({'error': str(e)})

@app.before_request
def before_request():
    if request.endpoint and request.endpoint != 'static':
        global saved_data
        saved_data = get_saved_data()

@app.route('/') 
def hello_world():  
    return 'ye bisa'


def ensure_upload_folder():
    if not os.path.exists(UPLOAD_FOLDER):
        os.makedirs(UPLOAD_FOLDER)

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def handle_uploaded_file(file, data, key):
    if file:
        file_extension = file.filename.rsplit('.', 1)[1].lower()
        file_filename = f"{data['name']}_{key}.{file_extension}"
        file_path = os.path.join(app.config['UPLOAD_FOLDER'], secure_filename(file_filename)).replace("\\", "/")
        file_url = f'http://127.0.0.1:5000/get_photo/uploads{os.path.basename(file_path)}'
        file.save(file_path)
        data[key] = file_path

    return file_url

def save_to_file(data):
    home = data.get("fotoHome", "")
    full_path_home = os.path.join(UPLOAD_FOLDER, home).replace("\\", "/")
    home2 = data.get("fotoHome2", "")
    full_path_home2 = os.path.join(UPLOAD_FOLDER, home2).replace("\\", "/")
    diri = data.get("fotoDiri", "")
    full_path_diri = os.path.join(UPLOAD_FOLDER, diri).replace("\\", "/")
    data_keluarga = {
        "name": data.get("name", ""),
        "ttl": data.get("ttl", ""),
        "job": data.get("job", ""),
        "blok": data.get("blok", ""),
        "no": data.get("no", ""),
        "lastEdu": data.get("lastEdu", ""),
        "platNomor": [],
        "comment": [],
        "pbb": data.get("taxNumber", ""),
        "bpjs": data.get("bpjsNumber", ""),
        "coordinates": data.get("coordinates", ""),
        "KK": data.get("statusKK", ""),
        "fotoHome": full_path_home,
        "fotoHome2": full_path_home2,
        "fotoDiri": full_path_diri,
        "istri": [],
        "anak": [],
        "statusAnak": [],
        "address": [],
        "nik": [],
        "statusKTP": [],
        "image_url_Home": data.get("image_url_Home", []),
        "image_url_Home2": data.get("image_url_Home2", []),
        "image_url_Diri": data.get("image_url_Diri", []),
    }

    data_keluarga["nik"].append(data.get("nik", ""))
    data_keluarga["address"].append(data.get("address", ""))
    print(data.get("statusKTP", ""))
    data_keluarga["statusKTP"].append(data.get("statusKTP", ""))

    i = 1

    # Mengumpulkan nama istri dari data
    while True:
        key_nama_istri = f"namaIstri{i}"
        nama_istri = data.get(key_nama_istri, "")
    
        if nama_istri:
            data_keluarga["istri"].append(nama_istri)
            i += 1
        else:
            break

    i = 1

    while True:
        key_nama_anak = f"namaAnak{i}"
        nama_anak = data.get(key_nama_anak, "")

        if nama_anak:
            data_keluarga["anak"].append(nama_anak)
            i += 1
        else:
            break

    i = 1

    while True:
        key_status_anak = f"statusAnak{i}"
        status_anak = data.get(key_status_anak, "")
    
        if status_anak:
            data_keluarga["statusAnak"].append(status_anak)
            i += 1
        else:
            break

    
    i = 0

    while True:
        key_nomor_plat = f"vehicleNumber{i}"
        nomor_plat = data.get(key_nomor_plat, "")
    
        if nomor_plat:
            data_keluarga["platNomor"].append(nomor_plat)
            i += 1
        else:
            break       

    i = 0

    while True:
        key_komen = f"additionalComment{i}"
        add_komen = data.get(key_komen, "")
    
        if add_komen:
            data_keluarga["comment"].append(add_komen)
            i += 1
        else:
            break   

    i = 1

    # Mengumpulkan nik istri dari data
    while True:
        key_nik_istri = f"nikIstri{i}"
        nik_istri = data.get(key_nik_istri, "")
    
        if nik_istri:
            data_keluarga["nik"].append(nik_istri)
            i += 1
        else:
            break

    i = 1

    # Mengumpulkan nik anak dari data
    while True:
        key_nik_anak = f"nikAnak{i}"
        nik_anak = data.get(key_nik_anak, "")
    
        if nik_anak:
            data_keluarga["nik"].append(nik_anak)
            i += 1
        else:
            break

    i = 1

    # Mengumpulkan alamat istri dari data
    while True:
        key_address_istri = f"alamatIstri{i}"
        address_istri = data.get(key_address_istri, "")
    
        if address_istri:
            data_keluarga["address"].append(address_istri)
            i += 1
        else:
            break

    i = 1

    # Mengumpulkan alamat anak dari data
    while True:
        key_address_anak = f"alamatAnak{i}"
        address_anak = data.get(key_address_anak, "")
    
        if address_anak:
            data_keluarga["address"].append(address_anak)
            i += 1
        else:
            break

    i = 1

    while True:
        key_status_ktp_istri = f"statusktpIstri{i}"
        status_ktp_istri = data.get(key_status_ktp_istri, "")
    
        if status_ktp_istri:
            data_keluarga["statusKTP"].append(status_ktp_istri)
            i += 1
        else:
            break

    i = 1

    # Mengumpulkan foto KTP anak dari data
    while True:
        key_status_ktp_anak = f"statusktpAnak{i}"
        status_ktp_anak = data.get(key_status_ktp_anak, "")
    
        if status_ktp_anak:
            data_keluarga["statusKTP"].append(status_ktp_anak)
            i += 1
        else:
            break

    with open('Warga.txt', 'a') as file:
        json_data = json.dumps(data_keluarga, default=str, ensure_ascii=False)
        file.write(json_data + "\n")

# Endpoint untuk menyimpan data
@app.route('/save_data', methods=['POST'])
def save_data():
    try:
        data = request.form.to_dict()
        print("Received Data:", data)
        # Mengonversi koordinat dari JSON string ke objek Python
        data['coordinates'] = json.loads(data['coordinates'])

        image_home_urls = []
        image_home2_urls = []
        image_diri_urls = []

        # Menghandle file-file yang diupload
        for file_key in request.files:
            file = request.files[file_key]
            if file:
                # Menyimpan file dengan nama yang sesuai
                file_url = handle_uploaded_file(file, data, file_key)

                if file_key == "fotoHome":
                    image_home_urls.append(file_url)
                elif file_key == "fotoHome2":
                    image_home2_urls.append(file_url)
                elif file_key == "fotoDiri":
                    image_diri_urls.append(file_url)

        # Menambahkan URL ke data yang akan disimpan
        data['image_url_Home'] = image_home_urls
        data['image_url_Home2'] = image_home2_urls
        data['image_url_Diri'] = image_diri_urls

                

        # Menyimpan data ke file.txt
        save_to_file(data)

        # Tambahkan header CORS ke respons
        response = jsonify({"message": "Data saved successfully"})
        response.headers.add('Access-Control-Allow-Origin', 'http://localhost:3000')  # Ganti dengan domain yang benar
        return response
    except Exception as e:
        print("Error:", str(e))
        return jsonify({"error": str(e)}), 500

@app.route('/get_saved_data', methods=['GET'])
def get_saved_data():
    try:
        search_query = request.args.get('search', '').lower()

        with open('Warga.txt', 'r') as file:
            saved_data = [json.loads(line.strip()) for line in file]

        # Filter data berdasarkan kriteria pencarian (nama)
        filtered_data = [data for data in saved_data if isinstance(data.get('name'), str) and search_query in data.get('name', '').lower()]


        # Tambahkan URL foto ke setiap data yang diambil
        for data in filtered_data:
            if 'image' in data:
                data['image_url'] = f'http://127.0.0.1:5000/get_photo/{os.path.basename(data["image"])}'

            # Check if the name exists in the saved_file_data dictionary
            if data['name'] in saved_file_data:
                data['fileName'] = saved_file_data[data['name']]['fileName']

        return jsonify({'savedData': filtered_data})
    except Exception as e:
        return handle_error(e)

# Inisialisasi data dari endpoint get_saved_data
with app.app_context():
    saved_data = get_saved_data()

# Endpoint untuk menyimpan data dari frontend
@app.route('/update_data', methods=['PUT'])
def update_data():
    try:
        data_from_frontend = request.get_json()
        # print(data_from_frontend)
        # Lakukan pembaruan data sesuai kebutuhan
        # Misalnya, kita akan menambahkan anak baru ke dalam array 'anak'
        saved_data['savedData'][0]['anak'].append(data_from_frontend['anak'])
        print(saved_data)
        # Simpan data yang diperbarui ke file
        save_to_file(saved_data['savedData'][0])

        return jsonify({'message': 'Data berhasil diperbarui di backend'})
    except Exception as e:
        return jsonify({'error': str(e)})


@app.route('/delete_data/<name>', methods=['DELETE'])
def delete_data(name):
    try:
        with open('Warga.txt', 'r') as file:
            saved_data = [json.loads(line.strip()) for line in file]

        updated_data = [data for data in saved_data if data.get('name') != name]

        with open('Warga.txt', 'w') as file:
            for data in updated_data:
                json_data = json.dumps(data, default=str, ensure_ascii=False)
                file.write(json_data + '\n')

        return jsonify({"message": "Data deleted successfully"})
    except Exception as e:
        return handle_error(e)


@app.route('/get_photo/uploads<filename>', methods=['GET'])
def get_photo(filename):
    try:
        return send_from_directory(app.config['UPLOAD_FOLDER'], filename)
    except Exception as e:
        return handle_error(e)
    

@app.route('/save_file_name', methods=['POST'])
def save_file_name():
    try:
        data = request.get_json()
        name = data.get('nama')
        file_name = data.get('fileName')

        # Baca data file Riwayat_surat.txt
        with open('Riwayat_surat.txt', 'r') as history_file:
            history_data = [json.loads(line.strip()) for line in history_file]

        # Temukan entri yang sesuai dengan nama
        entry_found = False
        for entry in history_data:
            if entry['nama'] == name:
                entry_found = True
                entry['fileNames'].append(file_name)
                break

        # Jika entri tidak ditemukan, tambahkan entri baru
        if not entry_found:
            history_data.append({'timestamp': datetime.now().strftime("%Y-%m-%d %H:%M:%S"), 'nama': name, 'fileNames': [file_name]})

        # Tulis kembali data ke dalam file Riwayat_surat.txt
        with open('Riwayat_surat.txt', 'w') as history_file:
            for entry in history_data:
                json_data = json.dumps(entry, default=str, ensure_ascii=False)
                history_file.write(json_data + '\n')

        return jsonify({"message": "File name saved successfully"})
    except Exception as e:
        return handle_error(e)


@app.route('/get_saved_file_name', methods=['GET'])
def get_saved_file_name():
    try:
        with open('Riwayat_surat.txt', 'r') as history_file:
            history_data = [json.loads(line.strip()) for line in history_file]

        result_data = []

        for entry in history_data:
            result_entry = {
                "timestamp": entry["timestamp"],
                "nama": entry["nama"],
                "fileNames": entry["fileNames"]
            }
            result_data.append(result_entry)

        return jsonify({'history': result_data})
    except Exception as e:
        return handle_error(e)



@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    username = data.get('name')
    password = data.get('password')

    # Bandingkan data dengan input pengguna
    if username == 'admin' and password == 'admin':
        user_data = {'name': 'admin', 'email': 'admin@example.com'}
        return jsonify(user_data)
    else:
        return jsonify({'error': 'Login failed. Check your username and password.'}), 401

@app.route('/get_multipolygon', methods=['GET'])
def get_multipolygon():
    multi_polygon = [
        [-7.004907588975661, 107.6361829016956],
        [-7.005636781043971, 107.63607150547568],
        [-7.005870158815059, 107.63695591129958],
        [-7.005611151796026, 107.6370264065953],
        [-7.005611151795504, 107.637238419831],
        [-7.005373857896837, 107.6372970617887],
        [-7.005280295178104, 107.6370170686941],
        [-7.00521107833573, 107.6370197509031],
        [-7.005203091776328, 107.63696610672356],
        [-7.005453337239119, 107.63689100487228],
        [-7.005328214520942, 107.6362606857531],
        [-7.004907588975661, 107.63630360109948]

    ]
    return jsonify({'multiPolygon': multi_polygon})

if __name__ == '__main__': 
    app.run()