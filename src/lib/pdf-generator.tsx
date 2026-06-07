import React from 'react';
import { Page, Text, View, Document, StyleSheet, pdf } from '@react-pdf/renderer';

const shop4youStyles = StyleSheet.create({
  page: { 
    padding: 50, 
    fontFamily: 'Helvetica',
    backgroundColor: '#ffffff',
    color: '#000000',
    fontSize: 10
  },
  brandHeader: { 
    fontSize: 24, 
    marginBottom: 40, 
    fontWeight: 'bold',
    letterSpacing: 2,
  },
  addressBlock: {
    marginBottom: 40,
    lineHeight: 1.5,
  },
  addressTitle: {
    fontSize: 8,
    textTransform: 'uppercase',
    letterSpacing: 1,
    color: '#71717a', // zinc-400
    marginBottom: 4
  },
  metaGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 30,
    borderBottomWidth: 1,
    borderBottomColor: '#e4e4e7',
    paddingBottom: 15
  },
  metaColumn: {
    flexDirection: 'column',
    gap: 2
  },
  metaLabel: {
    fontSize: 8,
    textTransform: 'uppercase',
    color: '#71717a',
    letterSpacing: 0.5
  },
  metaValue: {
    fontSize: 10,
    fontWeight: 'bold'
  },
  // 📊 Tabellen-Strukturen für die Artikelliste
  tableHeader: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#000000',
    paddingBottom: 6,
    marginBottom: 8,
    fontWeight: 'bold',
    fontSize: 9,
    textTransform: 'uppercase',
    letterSpacing: 0.5
  },
  tableRow: {
    flexDirection: 'row',
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: '#f4f4f5', // zinc-100
    alignItems: 'center'
  },
  colPos: { width: '8%' },
  colId: { width: '22%', color: '#71717a', fontSize: 8 },
  colTitle: { width: '40%', fontWeight: 'bold' },
  colQty: { width: '8%', textAlign: 'center' },
  colPrice: { width: '11%', textAlign: 'right' },
  colTotal: { width: '11%', textAlign: 'right' },

  summaryContainer: {
    marginTop: 30,
    flexDirection: 'column',
    alignItems: 'flex-end',
    gap: 6
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '40%',
    paddingVertical: 2
  },
  taxRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '40%',
    fontSize: 8,
    color: '#71717a',
    borderBottomWidth: 1,
    borderBottomColor: '#e4e4e7',
    paddingBottom: 4
  },
  finalTotalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '40%',
    fontSize: 14,
    fontWeight: 'bold',
    borderTopWidth: 1,
    borderTopColor: '#000000',
    paddingTop: 6,
    marginTop: 4
  }
});

interface InvoiceItem {
  position: number;
  productId: string;
  title: string;
  quantity: number;
  price: number;
}

interface InvoiceData {
  id: string;
  totalAmount: number;
  paymentMethod: string;
  createdAt: string;
  customer: {
    firstName: string;
    lastName: string;
    street: string;
    zipCode: string;
    city: string;
  };
  items: InvoiceItem[];
}

const InvoiceDocument = ({ order }: { order: InvoiceData }) => {
  // Berechnungen für den Steuerausweis
  const netTotal = order.totalAmount / 1.19;
  const taxAmount = order.totalAmount - netTotal;

  return (
    <Document>
      <Page size="A4" style={shop4youStyles.page}>
        
        {/* Logo / Header */}
        <View style={shop4youStyles.brandHeader}>
          <Text>SHOP4YOU // RECHNUNG</Text>
        </View>

        {/* Empfängeradresse */}
        <View style={shop4youStyles.addressBlock}>
          <Text style={shop4youStyles.addressTitle}>Liefer- & Rechnungsanschrift</Text>
          <Text style={{ fontWeight: 'bold' }}>{order.customer.firstName} {order.customer.lastName}</Text>
          <Text>{order.customer.street}</Text>
          <Text>{order.customer.zipCode} {order.customer.city}</Text>
        </View>

        {/* Rechnungsmetadaten im Grid */}
        <View style={shop4youStyles.metaGrid}>
          <View style={shop4youStyles.metaColumn}>
            <Text style={shop4youStyles.metaLabel}>Bestellnummer</Text>
            <Text style={shop4youStyles.metaValue}>{order.id.substring(0, 8).toUpperCase()}...</Text>
          </View>
          <View style={shop4youStyles.metaColumn}>
            <Text style={shop4youStyles.metaLabel}>Rechnungsdatum</Text>
            <Text style={shop4youStyles.metaValue}>
              {new Date(order.createdAt).toLocaleDateString('de-DE')}
            </Text>
          </View>
          <View style={shop4youStyles.metaColumn}>
            <Text style={shop4youStyles.metaLabel}>Zahlungsart</Text>
            <Text style={shop4youStyles.metaValue}>{order.paymentMethod.toUpperCase()}</Text>
          </View>
        </View>

        {/* Artikelliste Tabelle Header */}
        <View style={shop4youStyles.tableHeader}>
          <Text style={shop4youStyles.colPos}>Pos</Text>
          <Text style={shop4youStyles.colId}>Artikel-ID</Text>
          <Text style={shop4youStyles.colTitle}>Bezeichnung</Text>
          <Text style={shop4youStyles.colQty}>Menge</Text>
          <Text style={shop4youStyles.colPrice}>Einzel</Text>
          <Text style={shop4youStyles.colTotal}>Gesamt</Text>
        </View>

        {/* Tabellenzeilen für jeden Artikel */}
        {order.items.map((item) => (
          <View key={item.productId} style={shop4youStyles.tableRow}>
            <Text style={shop4youStyles.colPos}>{item.position}</Text>
            <Text style={shop4youStyles.colId}>{item.productId.substring(0, 12)}</Text>
            <Text style={shop4youStyles.colTitle}>{item.title.toUpperCase()}</Text>
            <Text style={shop4youStyles.colQty}>{item.quantity}</Text>
            <Text style={shop4youStyles.colPrice}>{item.price.toFixed(2)} €</Text>
            <Text style={shop4youStyles.colTotal}>{(item.price * item.quantity).toFixed(2)} €</Text>
          </View>
        ))}

        {/* Zusammenfassung & Steuerberechnung */}
        <View style={shop4youStyles.summaryContainer}>
          <View style={shop4youStyles.summaryRow}>
            <Text style={{ color: '#71717a' }}>Netto-Summe:</Text>
            <Text>{netTotal.toFixed(2)} €</Text>
          </View>
          <View style={shop4youStyles.taxRow}>
            <Text>Zzgl. 19% MwSt.:</Text>
            <Text>{taxAmount.toFixed(2)} €</Text>
          </View>
          <View style={shop4youStyles.finalTotalRow}>
            <Text>BRUTTO-TOTAL:</Text>
            <Text>{order.totalAmount.toFixed(2)} €</Text>
          </View>
        </View>

      </Page>
    </Document>
  );
};

export const generateInvoicePDF = async (order: InvoiceData) => {
  const blob = await pdf(<InvoiceDocument order={order} />).toBlob();
  return blob;
};