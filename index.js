(async function() {
    class TrendyolSellerAPI {
        #apiEndpoints = {
            follow: 'https://public.trendyol.com/discovery-sellerstore-mobilewebgw-service/api/follow/',
            storeUrl: 'https://public-sdc.trendyol.com/discovery-sellerstore-mobilewebgw-service/api/seller-store/getStoreUrl',
            availableCoupons: 'https://public.trendyol.com/discovery-sellerstore-mobilewebgw-service/api/coupon/getAvailableCoupons',
            profile: 'https://public-mdc.m.trendyol.com/discovery-sellerstore-mobilewebgw-service/seller-profile/magaza/profil',
        };

        constructor({ sellerId }) {
            this.sellerId = sellerId;
        }
    
        _fetchData(url) {
            return fetch(url).then(response => response.json());
        }
    
        getFollowers() {
            const url = `${this.#apiEndpoints.follow}?sellerId=${this.sellerId}`;
            return this._fetchData(url);
        }
    
        getStoreUrl() {
            const url = `${this.#apiEndpoints.storeUrl}?sellerId=${this.sellerId}`;
            return this._fetchData(url);
        }
        
        getAvailableCoupons() {
            const url = `${this.#apiEndpoints.availableCoupons}?sellerId=${this.sellerId}`;
            return this._fetchData(url);
        }
    
        getProfile() {
            const url = `${this.#apiEndpoints.profile}/0-m-${this.sellerId}?__renderMode=stream&storefrontId=1&channelId=1`;
            return this._fetchData(url).then(data => {
                const trueUrl = data['$headers'].Location;
                return this._fetchData(`${this.#apiEndpoints.profile}/../../${trueUrl}&__renderMode=stream&storefrontId=1`)
            });
        }
    }

    function createSellerWidget({ name, score, image, followers, link }) {
        const fragment = document.createDocumentFragment();
        const mainEl = document.createElement('div');
        mainEl.classList.add('seller-widget');
    
        const imageEl = document.createElement('img');
        imageEl.src = image;
        imageEl.alt = name;
        mainEl.appendChild(imageEl);
    
        const nameEl = document.createElement('h3');
        nameEl.textContent = name;
        mainEl.appendChild(nameEl);
    
        const scoreEl = document.createElement('span');
        scoreEl.textContent = `Mağaza Puanı: ${score}`;
        mainEl.appendChild(scoreEl);
    
        const followersEl = document.createElement('span');
        followersEl.textContent = `Takipçi: ${followers}`;
        mainEl.appendChild(followersEl);
    
        const linkEl = document.createElement('a');
        linkEl.href = link;
        linkEl.textContent = 'Mağaza Profili';
        mainEl.appendChild(linkEl);
    
        fragment.appendChild(mainEl);
    
        return fragment;
    }
    
    function createSellerWidgetCSS() {
        let sellerWidgetElCSS = document.createElement('style');
        sellerWidgetElCSS.innerHTML = `
            .seller-widget {
                border: 1px solid #D1D1D1;
                padding: 15px;
                width: 250px;
                height: 250px;
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                background-color: #FFFFFF;
                box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
                border-radius: 8px;
                font-family: Arial, sans-serif;
                overflow: hidden; 
                position: relative; 
                margin: 10px; 
            }

            .seller-widget img {
                width: 80px;
                height: 80px; 
                object-fit: cover;
                border-radius: 50%;
                margin-bottom: 10px;
            }

            .seller-widget h3 {
                margin: 5px 0;
                font-size: 1.2em;
                color: #333333;
                text-align: center;
            }

            .seller-widget span {
                color: #555555;
                font-size: 0.9em;
                margin: 2px 0;
                text-align: center;
            }

            .seller-widget a {
                background-color: #FF6000;
                color: white;
                padding: 6px 12px;
                text-decoration: none;
                border-radius: 4px;
                font-size: 0.9em;
                position: absolute;
                bottom: 15px;
                transition: background-color 0.3s;
            }

            .seller-widget a:hover {
                background-color: #CC4D00;
            }`;

        return sellerWidgetElCSS;
    }

    document.head.appendChild(createSellerWidgetCSS());
    
    const sellers = document.querySelectorAll('.trendyol-seller-profile');
    for (const seller of sellers) {
        const sellerId = seller.getAttribute('seller-id');
        const trendyolSellerAPI = new TrendyolSellerAPI({ sellerId });
    
        const followers = await trendyolSellerAPI.getFollowers();
        const storeUrl = await trendyolSellerAPI.getStoreUrl();
        const profile = await trendyolSellerAPI.getProfile();

        let profileDocument = new DOMParser().parseFromString(profile.main, 'text/html');
        let profileName = profileDocument.querySelector('.seller-info__wrapper__info-box__name').textContent;
        let profileScore = profileDocument.querySelector('.score-actual').textContent;
        let profileImage = profileDocument.querySelector('.seller-icon img').getAttribute('src');

        let followerCount = followers.text;
        let profileLink = storeUrl;

        let sellerWidget = createSellerWidget({
            name: profileName,
            score: profileScore,
            image: profileImage,
            followers: followerCount,
            link: profileLink
        });

        seller.appendChild(sellerWidget);
    }
})();
