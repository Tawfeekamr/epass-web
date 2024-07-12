import '@testing-library/jest-dom';

// Mock the Notification API
class MockNotification {
    static permission = 'granted';

    constructor(public title: string, public options?: NotificationOptions) {
    }

    static requestPermission() {
        return Promise.resolve(MockNotification.permission);
    }
}

global.Notification = MockNotification as any;

// Other setup code if needed
