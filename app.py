from flask import Flask, render_template, url_for

app = Flask(__name__)

@app.route('/')
def index():
    products = [
    {
        'name': 'Phở Ngũ Sắc',
        'label': 'Tinh hoa ngũ sắc',
        'desc': 'Phở ngũ sắc đặc sản Cao Bằng với màu sắc tự nhiên từ rau củ và ngũ cốc.',
        'img': url_for('static', filename='image/pho1.jpg'),

        'size1': '500g',
        'people1': '2–3 người ăn',
        'price1': '49.000đ',

        'size2': '1kg',
        'people2': 'Gia đình 4–5 người',
        'price2': '95.000đ',
    },

    {
        'name': 'Phở Ngô',
        'label': 'Đặc sản truyền thống',
        'desc': 'Sợi phở ngô dai mềm tự nhiên, vị mộc mạc đặc trưng vùng cao.',
        'img': url_for('static', filename='image/pho-ngo.jpg'),

        'size1': '500g',
        'people1': '2–3 người ăn',
        'price1': '39.000đ',

        'size2': '1kg',
        'people2': '4–5 người ăn',
        'price2': '69.000đ',
    },

    {
        'name': 'Phở Hoa Đậu Biếc',
        'label': 'Thanh vị mỗi ngày',
        'desc': 'Màu tím tự nhiên từ hoa đậu biếc, thanh nhẹ và dễ thưởng thức.',
        'img': url_for('static', filename='image/pho-hoa.jpg'),

        'size1': '500g',
        'people1': '2–3 người ăn',
        'price1': '42.000đ',

        'size2': '1kg',
        'people2': '4–5 người ăn',
        'price2': '72.000đ',
    },
]

    reviews = [
        {'name': 'Hải Yến', 'loc': 'TP. Hồ Chí Minh', 'initials': 'HY',
         'text': 'Sợi phở dai ngon, thơm mùi ngô tự nhiên. Nhà mình ai cũng thích, kể cả mấy đứa nhỏ khó tính.'},
        {'name': 'Minh Quân', 'loc': 'Hà Nội', 'initials': 'MQ',
         'text': 'Ăn nhẹ bụng hơn phở thường. Mình đang ăn healthy thấy rất hợp, tư vấn qua Zalo cũng nhanh lắm.'},
        {'name': 'Thu Thảo', 'loc': 'Đà Nẵng', 'initials': 'TT',
         'text': 'Đóng gói đẹp, mình mua làm quà biếu. Nhắn Zalo là có người tư vấn liền, giao hàng đúng hẹn.'},
    ]

    # ĐỔI SỐ ĐIỆN THOẠI / ZALO CỦA BẠN Ở ĐÂY
    contact = {
        'phone': '0979862956',
        'zalo': '0979862956',
    }

    return render_template('index.html', products=products, reviews=reviews, contact=contact)
@app.route('/')
def home():
    return render_template('index.html', products=products, reviews=reviews, contact=contact)

@app.route('/story')
def story():
    return render_template('story.html')
if __name__ == '__main__':
    app.run(debug=True)
