import mockData from '@/services/mockData/moods.json';

class MoodService {
  constructor() {
    this.data = [...mockData];
  }

  getAll() {
    return [...this.data];
  }

  getById(id) {
    const mood = this.data.find(item => item.Id === parseInt(id));
    if (!mood) {
      throw new Error('Mood not found');
    }
    return { ...mood };
  }
}

export const moodService = new MoodService();