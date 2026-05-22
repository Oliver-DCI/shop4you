import React from 'react';
import { Page, Text, View, Document, StyleSheet, pdf } from '@react-pdf/renderer';

// Einzigartiger Name, um globale Variablen-Konflikte zu vermeiden
const shop4youStyles = StyleSheet.create({
  page: { 
    padding: 40, 
    fontFamily: 'Helvetica',
    backgroundColor: '#ffffff',
    color: '#000000'
  },
  header: { 
    fontSize: 22, 
    marginBottom: 20, 
    fontWeight: 'bold',
    letterSpacing: 2,
    textTransform: 'uppercase'
  },
  metaSection: {
    marginBottom: 30,
    fontSize: 10,
    lineHeight: 1.5,
    color: '#52525b' // zinc-600
  },
  divider: {
    borderBottomWidth: 1,
    borderBottomColor: '#e4e4e7', // zinc-200
    marginBottom: 20
  },
  totalRow: {
    marginTop: 30,
    flexDirection: 'row',
    justifyContent: 'space-between',
    fontSize: 14,
    fontWeight: 'bold'
  }
});

// Typen-Definition für TypeScript
interface InvoiceData {
  id: string;
  totalAmount: number;
  paymentMethod: string;
  createdAt?: string | Date;
}

// Die React-PDF Komponente
const InvoiceDocument = ({ order }: { order: InvoiceData }) => (
  <Document>
    <Page size="A4" style={shop4youStyles.page}>
      <View style={shop4youStyles.header}>
        <Text>SHOP4YOU // RECHNUNG</Text>
      </View>

      <View style={shop4youStyles.metaSection}>
        <Text>Bestell-ID: {order.id}</Text>
        <Text>Zahlungsart: {order.paymentMethod.toUpperCase()}</Text>
        <Text>Datum: {order.createdAt ? new Date(order.createdAt).toLocaleDateString('de-DE') : new Date().toLocaleDateString('de-DE')}</Text>
      </View>

      <View style={shop4youStyles.divider} />

      <View style={shop4youStyles.totalRow}>
        <Text>GESAMTSUMME:</Text>
        <Text>{order.totalAmount.toFixed(2)} €</Text>
      </View>
    </Page>
  </Document>
);

// Der eigentliche Generator, den wir in den APIs/Actions aufrufen
export const generateInvoicePDF = async (order: InvoiceData) => {
  const blob = await pdf(<InvoiceDocument order={order} />).toBlob();
  return blob;
};