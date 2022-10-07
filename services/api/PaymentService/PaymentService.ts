import { Payment } from "../../../global/types/Payment";
import BaseService from "../BaseService";

class PaymentService extends BaseService {
  private paymentUrl = "/payment";

  async getAllPayments() {
    let payments: Payment[] = [];
    try {
      let response = await this.Api.get(this.paymentUrl, this.config);
      if (response.data) {
        payments = response.data as Payment[];
      }
    } catch (error) {
      this.handleError(error);
    }
    return payments;
  }

  async getPaymentById(paymentId: string) {
    let fetchedPayment = undefined;
    try {
      let response = await this.Api.get(
        `${this.paymentUrl}/${paymentId}`,
        this.config
      );
      if (response.data) {
        fetchedPayment = response.data as Payment;
      }
    } catch (error) {
      this.handleError(error);
    }
    return fetchedPayment;
  }

  async createPayment(payment: Payment) {
    let newPayment = undefined;
    try {
      let response = await this.Api.post(this.paymentUrl, payment, this.config);
      if (response.data) {
        newPayment = response.data as Payment;
      }
    } catch (error) {
      this.handleError(error);
    }
    return newPayment;
  }

  async editPayment(paymentId: string, payment: Payment) {
    let editedPayment = undefined;
    try {
      let response = await this.Api.put(
        `${this.paymentUrl}/${paymentId}`,
        payment,
        this.config
      );
      if (response.data) {
        editedPayment = response.data as Payment;
      }
    } catch (error) {
      this.handleError(error);
    }
    return editedPayment;
  }

  async deletePayment(paymentId: string) {
    try {
      await this.Api.delete(`${this.paymentUrl}/${paymentId}`, this.config);
    } catch (error) {
      this.handleError(error);
    }
  }
}

export default PaymentService;
