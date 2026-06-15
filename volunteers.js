<tr><td>${name}</td><td>${volunteerId}</td><td
style="
color:${color};
font-weight:bold;
"
>
${status}
</td></tr>
`;});

}
catch (error) {

console.log(error);

body.innerHTML = `

<tr>
<td colspan="3">
डेटा लोड नहीं हो सका।
</td>
</tr>
`;}
}

loadVolunteers();
