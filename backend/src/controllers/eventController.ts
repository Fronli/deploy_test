import { Request, Response } from 'express';

export const getEvents = (req: Request, res: Response) => {
    const events = [
        { id: 1, name: "Music Concert", date: "2026-05-01" },
        { id: 2, name: "Tech Seminar", date: "2026-06-15" }
    ];

    res.json(events);
};
