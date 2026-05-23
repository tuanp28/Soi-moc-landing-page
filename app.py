from flask import Flask, render_template

app = Flask(__name__)

@app.route('/')
def index():
    products = [
        {
            'name': 'Phở Ngô Truyền Thống',
            'price': '35.000đ',
            'label': 'Bán chạy nhất',
            'desc': 'Sợi phở ngô mộc mạc, dai ngon. Gói 500g đủ cho 2–3 người ăn.',
            'img': 'https://images.unsplash.com/photo-1569050467447-ce54b3bbc37d?q=80&w=700&auto=format&fit=crop'
        },
        {
            'name': 'Phở Ngô Sợi Mộc Premium',
            'price': '75.000đ',
            'label': 'Premium',
            'desc': 'Sợi thượng hạng, hộp quà sang trọng – lý tưởng để biếu tặng.',
            'img': 'https://images.unsplash.com/photo-1617093727343-374698b1b08d?q=80&w=700&auto=format&fit=crop'
        },
        {
            'name': 'Combo Gia Đình',
            'price': '165.000đ',
            'label': 'Tiết kiệm nhất',
            'desc': '3 gói truyền thống + 1 gói premium. Giảm 15% so với mua lẻ.',
            'img': 'https://images.unsplash.com/photo-1547592180-85f173990554?q=80&w=700&auto=format&fit=crop'
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
