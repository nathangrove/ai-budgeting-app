import Imap, { ImapMessage } from 'imap';
import { simpleParser } from 'mailparser';

export interface Email {
  raw: string;
  text: string;
  subject: string;
  from: string;
  date: Date;
  analysis?: {
    institution: string;
    account: string;
    vendor: string;
    amount: number;
  };
  error?: string;
}
export async function parse(imapConnection: any): Promise<Email[]> {
  return new Promise((resolve, reject) => {
    const emails: Email[] = [];
    imapConnection.search(['UNSEEN'], (err: Error, results: ImapMessage[]) => {
      if (err) {
        console.error('Error searching emails:', err);
        return reject(err);
      }
      // take the last 5 emails
      results = results.slice(-1);
      console.log('Found emails:', results.length);
      const fetch = imapConnection.fetch(results, { 
        bodies: [''],
        markSeen: true, // Mark emails as seen after fetching
      });
      fetch.on('message', (msg: ImapMessage) => {
        msg.on('body', function(stream, info) {
          var buffer = '';
          stream.on('data', function(chunk) {
            buffer += chunk.toString('utf8');
          });
          stream.once('end', async function() {

            const parsed = await simpleParser(buffer,{
              skipImageLinks: true,
              skipTextLinks: true,
              skipTextToHtml: true,
            });
            emails.push({
              text: parsed.text ?? (parsed.html || ''),
              raw: buffer,
              subject: parsed.subject ?? buffer.split('Subject: ')[1]?.split('\n')[0],
              from: parsed.from?.text ?? buffer.split('From: ')[1]?.split('\n')[0],
              date: parsed.date ?? new Date(buffer.split('Date: ')[1]?.split('\n')[0]),
            })

            if (emails.length === results.length) {
              resolve(emails);
            }
          });
        });
      });
      fetch.once('error', (err: Error) => {
        console.error('Fetch error:', err);
        reject(err)
      });
      fetch.once('end', () => {
        imapConnection.end();
      });
    });
  });
}

export function connect(imapSettings: { host: string; port: number; user: string; password: string }): Promise<Imap> {
  return new Promise((resolve, reject) => {
    try {
      const imap = new Imap({
        user: imapSettings.user,
        password: imapSettings.password,
        host: imapSettings.host,
        port: imapSettings.port,
        tls: true
      });

      imap.once('ready', function() {
        imap.openBox('INBOX', true,(async function(err: any, box: any) {
          if (err) throw err;
          else resolve(imap);
        }));
      });

      imap.once('error', function(err: Error) {
        console.log(err);
        reject(err);
        imap.end();
      });

      imap.once('end', function() {
        console.log('Connection ended');
      });

      imap.connect();
    } catch (error) {
      console.error('Error connecting to IMAP server:', error);
      reject(error);
    }
  });
}
