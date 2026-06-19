window.generateAppointmentPDF = function (data) {
    const volunteerId = data.volunteer_id || data.volunteerId || "-";
    const date = new Date().toLocaleDateString("hi-IN");
    
    // एक अस्थायी कंटेनर बनाएं
    const element = document.createElement('div');
    element.style.width = "794px"; // A4 का साइज
    element.style.padding = "40px";
    element.style.backgroundColor = "white";
    element.style.fontFamily = "Arial, sans-serif";

    element.innerHTML = `
        <div style="border: 5px double #d4af37; padding: 30px;">
            <div style="text-align:center;">
                <h1 style="color:#071b34; margin:0;">उन्नति स्वयं सहायता समिति</h1>
                <p>गौ सेवा • मानव सेवा • राष्ट्र सेवा</p>
                <h2 style="border-bottom: 1px solid #000; display:inline-block;">नियुक्ति पत्र (Appointment Letter)</h2>
            </div>
            
            <div style="display:flex; justify-content:space-between; margin-top:20px;">
                <p><strong>पत्र संख्या:</strong> USS/APP/${new Date().getFullYear()}/${Date.now()}</p>
                <p><strong>दिनांक:</strong> ${date}</p>
            </div>

            <div style="margin-top:20px;">
                <p><strong>नाम:</strong> ${data.name || "-"}</p>
                <p><strong>पिता/पति का नाम:</strong> ${data.father_name || "-"}</p>
                <p><strong>मोबाइल:</strong> ${data.mobile || "-"}</p>
                <p><strong>पद:</strong> ${data.designation || "Volunteer"}</p>
                <p><strong>Volunteer ID:</strong> ${volunteerId}</p>
            </div>

            <div style="margin-top:30px; line-height:1.6;">
                <p>महोदय/महोदया, आपकी सामाजिक सेवा एवं राष्ट्र निर्माण के प्रति समर्पण को देखते हुए आपको उन्नति स्वयं सहायता समिति के अंतर्गत <b>${data.designation || "Volunteer"}</b> पद पर नियुक्त किया जाता है।</p>
                <p>आपकी नियुक्ति तत्काल प्रभाव से लागू होगी।</p>
            </div>

            <div style="margin-top:50px; text-align:right;">
                <p><strong>अधिकृत हस्ताक्षर</strong></p>
                <p>राष्ट्रीय सचिव</p>
            </div>
        </div>
    `;

    // PDF जनरेट करें
    const opt = {
        margin:       5,
        filename:     `${data.name}-Appointment.pdf`,
        image:        { type: 'jpeg', quality: 0.98 },
        html2canvas:  { scale: 2 },
        jsPDF:        { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };

    html2pdf().set(opt).from(element).save();
};
