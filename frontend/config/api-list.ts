const BASE_URL = process.env.NEXT_PUBLIC_API_URL

const ApiList = {
  BASE_URL: BASE_URL,
  Login: BASE_URL + 'auth/login',
  Register: BASE_URL + 'auth/signup',
  Products : BASE_URL + 'products',
  Product : BASE_URL + 'products/',
  Orders  : BASE_URL + 'orders/',



  // Admin
  AdminLogin : BASE_URL + 'auth/admin/login',
  AddProduct : BASE_URL + 'products',
  Files : BASE_URL + 'upload'
};

export default ApiList;  