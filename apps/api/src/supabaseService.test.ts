
describe('getOrCreateStudent', () => {
    it('should return existing student if found', async () => {
        const mockStudent = { id: 1, telegram_id: 12345, role: 'student' };
        mocks.single.mockResolvedValueOnce({ data: mockStudent, error: null });

        const result = await getOrCreateStudent({ id: 12345, first_name: 'Test' } as any);
        expect(result).toEqual(mockStudent);
    });

    it('should create new student if not found', async () => {
        mocks.single.mockResolvedValueOnce({ data: null, error: { code: 'PGRST116' } }); // Not found
        const newStudent = { id: 2, telegram_id: 67890, role: 'student' };
        mocks.single.mockResolvedValueOnce({ data: newStudent, error: null }); // Return after insert

        const result = await getOrCreateStudent({ id: 67890, first_name: 'New' } as any);
        expect(result).toEqual(newStudent);
    });
});
