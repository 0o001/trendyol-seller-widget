(function() {
    class TrendyolSellerAPI {
        apiEndpoints = {
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
            const url = `${this.apiEndpoints.follow}?sellerId=${this.sellerId}`;
            return this._fetchData(url);
        }
    
        getStoreUrl() {
            const url = `${this.apiEndpoints.storeUrl}?sellerId=${this.sellerId}`;
            return this._fetchData(url);
        }
        
        getAvailableCoupons() {
            const url = `${this.apiEndpoints.availableCoupons}?sellerId=${this.sellerId}`;
            return this._fetchData(url);
        }
    
        getProfile() {
            const url = `${this.apiEndpoints.profile}/0-m-${this.sellerId}?__renderMode=stream&storefrontId=1&channelId=1`;
            return this._fetchData(url).then(data => {
                return this._fetchData(`${this.apiEndpoints.profile}/../../${data['$headers'].Location}&__renderMode=stream&storefrontId=1`)
            });
        }
    }
    
    const trendyolSellerAPI = new TrendyolSellerAPI({ sellerId: '360942' });
    
    trendyolSellerAPI.getFollowers().then(data => console.log('Followers:', data));
    trendyolSellerAPI.getStoreUrl().then(data => console.log('Store URL:', data));
    trendyolSellerAPI.getAvailableCoupons().then(data => console.log('Available Coupons:', data));
    trendyolSellerAPI.getProfile().then(data => console.log('Profile:', data));
    
})();
