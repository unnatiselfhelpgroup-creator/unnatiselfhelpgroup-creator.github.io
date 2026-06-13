rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    // Volunteers List
    match /Volunteers/{docId} {
      allow read: if true;
      allow create: if true;
      allow update, delete: if false;
    }

    // Appointment Applications
    match /Appointments/{docId} {
      allow create: if request.resource.data.keys().hasOnly([
        'name',
        'father_name',
        'address',
        'mobile',
        'email',
        'designation',
        'volunteer_id',
        'status',
        'createdAt'
      ]);
      allow read: if true;
      allow update, delete: if false;
    }

    // Experience Certificate Requests
    match /CertificateRequests/{docId} {
      allow create: if request.resource.data.keys().hasOnly([
        'name',
        'volunteer_id',
        'choice',
        'status',
        'createdAt'
      ]);
      allow read: if true;
      allow update, delete: if false;
    }

    // Generated Certificates
    match /Certificates/{docId} {
      allow read: if true;
      allow create: if request.resource.data.keys().hasOnly([
        'certificateNo',
        'name',
        'volunteer_id',
        'days',
        'issueDate'
      ]);
      allow update, delete: if false;
    }

    // ID Card Applications
    match /IDCards/{docId} {
      allow create: if request.resource.data.keys().hasOnly([
        'name',
        'designation',
        'mobile',
        'email',
        'address',
        'volunteer_id',
        'id_number',
        'photoURL',
        'cardIssued',
        'status',
        'createdAt'
      ]);
      allow read: if true;
      allow update, delete: if false;
    }

    // Student Registration
    match /Students/{docId} {
      allow create: if request.resource.data.keys().hasOnly([
        'name',
        'email',
        'mobile',
        'college',
        'duration',
        'volunteer_id',
        'status',
        'createdAt'
      ]);
      allow read: if true;
      allow update, delete: if false;
    }

    // Daily Service Reports
    match /DailyReports/{docId} {
      allow create: if request.resource.data.keys().hasOnly([
        'name',
        'volunteer_id',
        'date',
        'work_details',
        'work_photo',
        'hours',
        'status',
        'createdAt'
      ]);
      allow read: if true;
      allow update, delete: if false;
    }

    // Donations
    match /Donations/{docId} {
      allow create: if request.resource.data.keys().hasOnly([
        'name',
        'mobile',
        'email',
        'amount',
        'transactionId',
        'status',
        'createdAt'
      ]);
      allow read: if true;
      allow update, delete: if false;
    }

    // Generic Submissions
    match /Submissions/{docId} {
      allow create: if true;
      allow read: if true;
      allow update, delete: if false;
    }

    // Block all other collections
    match /{document=**} {
      allow read, write: if false;
    }
  }
}
