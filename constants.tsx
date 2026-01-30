
import React from 'react';

export const SHIRT_PRICE = 250;
export const SHIPPING_COST = 50;

const getDriveDirectUrl = (id: string) => `https://drive.google.com/thumbnail?id=${id}&sz=w1000`;

export const IMAGE_LINKS = {
  shirt1: getDriveDirectUrl('1IIzHXmo9zJpA9y2qSE-v5RSDQOuO9v59'),
  shirt2: getDriveDirectUrl('1FgRrF94c7gJDlbAIUZflXOTf85VY_D7W'),
  shirt3: getDriveDirectUrl('1VXRmV_yFkkjBhPeTjg_ClmZR3n_6LmhK'),
  sizeChart: getDriveDirectUrl('1KhxOIfb8XtFJyfA9VC6p5q0P_SF-CuWj'),
};

export const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbyvZEr-EiOPGOLG9jLfglYfMoaOCJ-yuk6eKecDdJjwBCcBhqX6l6wtSTnumipcpjri/exec';

export const SIZES = ['ss', 's', 'm', 'l', 'xl', '2xl', '3xl', '4xl', '5xl'] as const;

export const ICONS = {
  CheckCircle: (props: any) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
  ),
  Search: (props: any) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
  ),
  Package: (props: any) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="m7.5 4.27 9 5.15"/><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/><path d="m3.3 7 8.7 5 8.7-5"/><path d="M12 22V12"/></svg>
  ),
  Upload: (props: any) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" x2="12" y1="3" y2="15"/></svg>
  )
};
