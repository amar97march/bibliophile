// import logo from './logo.svg';
import { CognitoUserPool } from 'amazon-cognito-identity-js'

const poolData = {
    UserPoolId: 'ap-south-1_SHAVBsp2a',
    ClientId: '2qgvoimt1ol5osn8lgstb3009d'
  };

export default new CognitoUserPool(poolData)
