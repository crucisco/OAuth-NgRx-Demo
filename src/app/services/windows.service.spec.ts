import { WindowsService } from './windows.service';

describe('WindowsService', () => {
  let service: WindowsService;

  beforeEach(() => {
    service = new WindowsService();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should have isInIframe signal', () => {
    expect(service.isInIframe).toBeDefined();
    expect(typeof service.isInIframe).toBe('function');
  });

  it('should correctly detect not in iframe context', () => {
    // Simulate not in iframe
    spyOnProperty(window, 'parent', 'get').and.returnValue(window);
    spyOnProperty(window, 'opener', 'get').and.returnValue(true);
    const service = new WindowsService();
    expect(service.isInIframe()).toBeFalse();
  });

  it('should correctly detect in iframe context', () => {
    // Simulate in iframe
    spyOnProperty(window, 'parent', 'get').and.returnValue({} as Window);
    spyOnProperty(window, 'opener', 'get').and.returnValue(false);
    const service = new WindowsService();
    expect(service.isInIframe()).toBeTrue();
  });
});
