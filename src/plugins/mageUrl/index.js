export default function MageUrl() {
    //Magic function '$url' works like the old 'mage/url' of magento luma theme
    Alpine.magic('mageUrl', (el, data) => {
        return (route_path, params) => {
            route_path = route_path.replace(/(^\/)?(\/$)?/, '');
            const urlBuilder = new URL(BASE_URL + route_path);

            Object.keys(params).map((key) => {
                urlBuilder.searchParams.append(key, params[key]);
            });
            return urlBuilder.href;
        }
    });
}

