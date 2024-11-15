import { describe, expect, it } from 'vitest';
import { SQLocal } from '../src/index.js';

describe('getDatabaseFile', () => {
	const fileName = 'get-database-file-test.sqlite3';
	const paths = [[], [''], ['top'], ['one', 'two']];

	it('should return the requested database file', async () => {
		for (let path of paths) {
			const databasePath = [...path, fileName].join('/');
			const { sql, getDatabaseFile, deleteDatabaseFile } = new SQLocal(
				databasePath
			);

			await sql`CREATE TABLE nums (num REAL NOT NULL)`;
			const file = await getDatabaseFile();
			const now = new Date().getTime();

			expect(file).toBeInstanceOf(File);
			expect(file.name).toBe(fileName);
			expect(file.size).toBe(16384);
			expect(file.type).toBe('application/x-sqlite3');
			expect(now - file.lastModified).toBeLessThan(50);

			await deleteDatabaseFile();
		}
	});

	it('should not throw when requested database has not been created', async () => {
		const { getDatabaseFile } = new SQLocal('blank.sqlite3');
		await expect(getDatabaseFile()).resolves.not.toThrow();
	});
});
