import axios from 'axios';
import { btcPayApiKey, btcPayBaseUrl, btcPayStoreId } from '../../config';



const config = {
    headers: {
        'Authorization': `token ${btcPayApiKey}`,
        'Content-Type': 'application/json'
    }
};

axios.get(`${btcPayBaseUrl}/api/v1/stores/${btcPayStoreId}/invoices`, config)
    .then(response => {
        console.log('Инвойсы:', response.data);
    })
    .catch(error => {
        console.error('Ошибка при запросе инвойсов:', error);
    });
