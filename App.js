import React, {Component} from 'react';
import {ApplePay} from 'react-native-apay';

import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Alert,
  Platform,
} from 'react-native';
import {
  GooglePay,
  RequestDataType,
  AllowedCardNetworkType,
  AllowedCardAuthMethodsType,
} from 'react-native-google-pay';

const allowedCardNetworks: AllowedCardNetworkType[] = ['VISA', 'MASTERCARD'];
const allowedCardAuthMethods: AllowedCardAuthMethodsType[] = [
  'PAN_ONLY',
  'CRYPTOGRAM_3DS',
];

const requestData: RequestDataType = {
  cardPaymentMethod: {
    tokenizationSpecification: {
      type: 'PAYMENT_GATEWAY',
      gateway: 'example',
      gatewayMerchantId: 'exampleGatewayMerchantId',
    },
    allowedCardNetworks,
    allowedCardAuthMethods,
  },
  transaction: {
    totalPrice: '123',
    totalPriceStatus: 'FINAL',
    currencyCode: 'RUB',
  },
  merchantName: 'Example Merchant',
};

const requestDataApplePay = {
  merchantIdentifier: 'merchant.com.example',
  supportedNetworks: ['mastercard', 'visa'],
  countryCode: 'SG',
  currencyCode: 'SGD',
  paymentSummaryItems: [
    {
      label: 'Item label',
      amount: '100.00',
    },
  ],
};

const stripeRequestData: RequestDataType = {
  cardPaymentMethod: {
    tokenizationSpecification: {
      type: 'PAYMENT_GATEWAY',
      gateway: 'stripe',
      gatewayMerchantId: '',
      stripe: {
        publishableKey: 'pk_test_TYooMQauvdEDq54NiTphI7jx',
        version: '2018-11-08',
      },
    },
    allowedCardNetworks,
    allowedCardAuthMethods,
  },
  transaction: {
    totalPrice: '123',
    totalPriceStatus: 'FINAL',
    currencyCode: 'RUB',
  },
  merchantName: 'Example Merchant',
};

export default class App extends Component {
  componentDidMount() {
    // Set the environment before the payment request
    if (Platform.OS === 'android') {
      GooglePay.setEnvironment(GooglePay.ENVIRONMENT_TEST);
    }
  }

  payWithGooglePay = () => {
    // Check if Google Pay is available
    GooglePay.isReadyToPay(allowedCardNetworks, allowedCardAuthMethods).then(
      ready => {
        if (ready) {
          // Request payment token
          GooglePay.requestPayment(requestData)
            .then(this.handleSuccess)
            .catch(this.handleError);
        }
      },
    );
  };

  payWithStripeGooglePay = () => {
    // Check if Google Pay is available
    GooglePay.isReadyToPay(allowedCardNetworks, allowedCardAuthMethods).then(
      ready => {
        if (ready) {
          // Request payment token
          GooglePay.requestPayment(stripeRequestData)
            .then(this.handleSuccess)
            .catch(this.handleError);
        }
      },
    );
  };

  payWithApplePay = () => {
    if (ApplePay.canMakePayments) {
      ApplePay.requestPayment(requestDataApplePay).then(paymentData => {
        console.log(paymentData);
        // Simulate a request to the gateway
        setTimeout(() => {
          // Show status to user ApplePay.SUCCESS || ApplePay.FAILURE
          ApplePay.complete(ApplePay.SUCCESS).then(() => {
            console.log('completed');
            // do something
          });
        }, 1000);
      });
    }
  };

  handleSuccess = (token: string) => {
    // Send a token to your payment gateway
    Alert.alert('Success', `token: ${token}`);
  };

  handleError = (error: any) =>
    Alert.alert('Error', `${error.code}\n${error.message}`);

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.welcome}>Welcome to react-native-google-pay!</Text>
        <TouchableOpacity
          style={[styles.button, Platform.OS === 'ios' ? styles.hidden : {}]}
          onPress={this.payWithGooglePay}>
          <Text style={styles.buttonText}>Buy with Google Pay</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, styles.stripe]}
          onPress={this.payWithStripeGooglePay}>
          <Text style={styles.buttonText}>Buy with Stripe Google Pay</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.button,
            Platform.OS === 'android' ? styles.hidden : {},
          ]}
          onPress={this.payWithApplePay}>
          <Text style={styles.buttonText}>Buy with Apple Pay</Text>
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff',
  },
  welcome: {
    fontSize: 18,
    color: '#222',
    marginBottom: 16,
  },
  button: {
    backgroundColor: '#34a853',
    borderRadius: 8,
    height: 56,
    paddingHorizontal: 24,
    justifyContent: 'center',
    marginVertical: 8,
  },
  stripe: {
    backgroundColor: '#556cd6',
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 18,
  },
  hidden: {
    width: 0,
    height: 0,
  },
});
