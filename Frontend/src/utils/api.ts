// utils/api.ts
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5858';

export const api = {
  // Schedule APIs
  async updateScheduleProgress(scheduleId: number, data: { completed_lectures: number; current_topic: string; next_topic: string }) {
    const response = await fetch(`${API_URL}/schedules/${scheduleId}/progress`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    return response.json();
  },

  async markAttendance(data: { schedule_id: number; teacher_id: number; present: number; absent?: number; remarks?: string }) {
    const response = await fetch(`${API_URL}/schedules/attendance`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    return response.json();
  },

  async addResource(data: { schedule_id: number; name: string; type: string; size?: string; url?: string }) {
    const response = await fetch(`${API_URL}/schedules/resource`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    return response.json();
  },

  async getTodaySchedule(teacherId: number) {
    const response = await fetch(`${API_URL}/schedules/teacher/${teacherId}`);
    return response.json();
  },

  // Request APIs
  async getAllRequests(status?: string) {
    const url = status ? `${API_URL}/requests?status=${status}` : `${API_URL}/requests`;
    const response = await fetch(url);
    return response.json();
  },

  async getRequestById(requestId: number) {
    const response = await fetch(`${API_URL}/requests/${requestId}`);
    return response.json();
  },

  async createRequest(data: { type: string; from_id: number; details: any }) {
    const response = await fetch(`${API_URL}/requests`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    return response.json();
  },

  async approveRequest(requestId: number, approvedBy: number) {
    const response = await fetch(`${API_URL}/requests/${requestId}/approve`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ approved_by: approvedBy }),
    });
    return response.json();
  },

  async rejectRequest(requestId: number, approvedBy: number) {
    const response = await fetch(`${API_URL}/requests/${requestId}/reject`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ approved_by: approvedBy }),
    });
    return response.json();
  },

  // Notification APIs
  async getNotifications(teacherId: number) {
    const response = await fetch(`${API_URL}/notifications/${teacherId}`);
    return response.json();
  },

  async getUnreadCount(teacherId: number) {
    const response = await fetch(`${API_URL}/notifications/${teacherId}/unread-count`);
    return response.json();
  },

  async markAsRead(notificationId: number) {
    const response = await fetch(`${API_URL}/notifications/${notificationId}/read`, {
      method: 'PUT',
    });
    return response.json();
  },

  async markAllAsRead(teacherId: number) {
    const response = await fetch(`${API_URL}/notifications/${teacherId}/read-all`, {
      method: 'PUT',
    });
    return response.json();
  },

  async createNotification(data: { teacher_id: number; title: string; message: string; type?: string; link?: string }) {
    const response = await fetch(`${API_URL}/notifications`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    return response.json();
  },

  async deleteNotification(notificationId: number) {
    const response = await fetch(`${API_URL}/notifications/${notificationId}`, {
      method: 'DELETE',
    });
    return response.json();
  },
};
