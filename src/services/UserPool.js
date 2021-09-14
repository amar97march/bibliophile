// import logo from './logo.svg';
import { CognitoUserPool } from 'amazon-cognito-identity-js'

const poolData = {
    UserPoolId: 'ap-south-1_ptnCibf5o',
    ClientId: '5j60eqnq7b8v9g6op088qccmdm'
  };

export default new CognitoUserPool(poolData)
