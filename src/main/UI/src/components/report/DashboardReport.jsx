import React from 'react';
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';

// Create styles for PDF
const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#FFFFFF',
    padding: 30,
  },
  section: {
    margin: 10,
    padding: 10,
    flexGrow: 1,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: 18,
    marginBottom: 10,
    fontWeight: 'bold',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 20,
  },
  statCard: {
    width: '45%',
    margin: '2.5%',
    padding: 10,
    backgroundColor: '#F3F4F6',
    borderRadius: 5,
  },
  statTitle: {
    fontSize: 12,
    color: '#6B7280',
  },
  statValue: {
    fontSize: 20,
    color: '#111827',
    marginTop: 5,
    fontWeight: 'bold',
  },
  dataTable: {
    width: '100%',
    marginBottom: 20,
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#F3F4F6',
    padding: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  tableRow: {
    flexDirection: 'row',
    padding: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  tableCell: {
    flex: 1,
    fontSize: 10,
  },
  footnote: {
    fontSize: 8,
    color: '#6B7280',
    marginTop: 20,
    textAlign: 'center',
  },
  activityItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 5,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  taskTitle: {
    fontSize: 10,
    flex: 2,
  },
  taskDate: {
    fontSize: 10,
    flex: 1,
    textAlign: 'right',
  },
  distributionGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    padding: 10,
  },
  distributionItem: {
    width: '30%',
    margin: '1.5%',
    padding: 8,
  },
  distributionLabel: {
    fontSize: 10,
    color: '#6B7280',
  },
  distributionValue: {
    fontSize: 14,
    color: '#111827',
    fontWeight: 'bold',
    marginTop: 4,
  },
});

const DashboardReport = ({ stats, taskActivityData, taskStatusData, recentTasks }) => {
  const generateTimestamp = () => {
    return new Date().toLocaleString();
  };

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.section}>
          <Text style={styles.title}>Dashboard Report</Text>
          
          {/* Stats Summary */}
          <Text style={styles.subtitle}>Key Statistics</Text>
          <View style={styles.statsGrid}>
            {stats.map((stat) => (
              <View key={stat.title} style={styles.statCard}>
                <Text style={styles.statTitle}>{stat.title}</Text>
                <Text style={styles.statValue}>{stat.value}</Text>
              </View>
            ))}
          </View>

          {/* Task Activity Table */}
          <Text style={styles.subtitle}>Task Activity (Last 7 Days)</Text>
          <View style={styles.dataTable}>
            <View style={styles.tableHeader}>
              <Text style={styles.tableCell}>Day</Text>
              <Text style={styles.tableCell}>Tasks Created</Text>
            </View>
            {taskActivityData.map((day) => (
              <View key={day.name} style={styles.tableRow}>
                <Text style={styles.tableCell}>{day.name}</Text>
                <Text style={styles.tableCell}>{day.tasks}</Text>
              </View>
            ))}
          </View>

          {/* Task Distribution */}
          <Text style={styles.subtitle}>Task Status Distribution</Text>
          <View style={styles.distributionGrid}>
            {taskStatusData.map((status) => (
              <View key={status.name} style={styles.distributionItem}>
                <Text style={styles.distributionLabel}>{status.name}</Text>
                <Text style={styles.distributionValue}>{status.value}</Text>
              </View>
            ))}
          </View>

          {/* Recent Activity */}
          <Text style={styles.subtitle}>Recent Activity</Text>
          <View style={styles.dataTable}>
            {recentTasks.map((task) => (
              <View key={task.id} style={styles.activityItem}>
                <Text style={styles.taskTitle}>{task.title}</Text>
                <Text style={styles.taskDate}>
                  {new Date(task.createdAt).toLocaleDateString()}
                </Text>
              </View>
            ))}
          </View>

          <Text style={styles.footnote}>
            Report generated on {generateTimestamp()}
          </Text>
        </View>
      </Page>
    </Document>
  );
};

export default DashboardReport;
