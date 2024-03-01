saved_data = get_saved_data()

# # Endpoint untuk menyimpan data dari frontend
# @app.route('/update_data', methods=['POST'])
# def update_data():
#     try:
#         data = request.form.to_dict()
#         print("Received Data:", data)
        
#         # ... (proses lainnya)

#         # Menyimpan data ke file.txt
#         save_to_file(data)

#         # Tambahkan header CORS ke respons
#         response = jsonify({"message": "Data saved successfully"})
#         response.headers.add('Access-Control-Allow-Origin', 'http://localhost:3000')  # Ganti dengan domain yang benar
        
#         # Memperbarui saved_data setelah penyimpanan data
#         global saved_data
#         saved_data = get_saved_data()

#         return response
#     except Exception as e:
#         print("Error:", str(e))
#         return jsonify({"error": str(e)}), 500