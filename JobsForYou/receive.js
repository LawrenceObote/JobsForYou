const amqp = require("amqplib");
require("dotenv").config();
const { getJson } = require("serpapi");
const sgMail = require("@sendgrid/mail");

sgMail.setApiKey(process.env.SENDGRID_KEY);

const queue = "job_postings";

(async () => {
  try {
    const connection = await amqp.connect("amqp://localhost");
    const channel = await connection.createChannel();

    process.once("SIGINT", async () => {
      await channel.close();
      await connection.close();
    });

    await channel.assertQueue(queue, { durable: false });
    await channel.consume(
      queue,
      async (message) => {
        console.log(" [x] Received '%s'", message.content.toString());
        const text = {
          search_metadata: {
            id: "656233a3fdca3e06f53ca983",
            status: "Success",
            json_endpoint:
              "https://serpapi.com/searches/24965aaeaa0e6e44/656233a3fdca3e06f53ca983.json",
            created_at: "2023-11-25 17:49:23 UTC",
            processed_at: "2023-11-25 17:49:23 UTC",
            google_jobs_url:
              "https://www.google.com/search?q=barista+new+york&ibp=htl;jobs&hl=en",
            raw_html_file:
              "https://serpapi.com/searches/24965aaeaa0e6e44/656233a3fdca3e06f53ca983.html",
            total_time_taken: 0.83,
          },
          search_parameters: {
            q: "barista new york",
            engine: "google_jobs",
            google_domain: "google.com",
            hl: "en",
          },
          jobs_results: [
            {
              title: "Barista",
              company_name: "The Alderman NYC",
              location: "  New York, NY   ",
              via: "via Culinary Agents",
              description:
                "Renwick Hospitality Group is opening The Alderman at the brand new Motto By Hilton | Times Square and is now looking for baristas to join the opening team. Are you a self-starter who thrives on multi-tasking? Do you have a love for coffee? Are you looking to break into the hospitality industry? Experience is helpful but we will train someone who has a strong work ethic and the right attitude. At... The Alderman, you will spend your day interacting with guests, making quality coffee drinks, and offering different snacks and items to passersby.\n\nJob responsibilities include but are not limited to:\n• Stocking of fridges, shelves, and more.\n• Organizing storage areas.\n• Receiving deliveries.\n• Making coffee to the high standards held by Renwick Hospitality Group.\n• Greeting guests in and out of the food & beverage areas.\n• Money management.\n• & more!\nBE IN THE KNOW..\n• Must be available for morning and evening shifts.\n• Passionate and kind with a love for hospitality",
              job_highlights: [
                {
                  title: "Qualifications",
                  items: [
                    "Experience is helpful but we will train someone who has a strong work ethic and the right attitude",
                    "Must be available for morning and evening shifts",
                    "Passionate and kind with a love for hospitality",
                  ],
                },
                {
                  title: "Responsibilities",
                  items: [
                    "At The Alderman, you will spend your day interacting with guests, making quality coffee drinks, and offering different snacks and items to passersby",
                    "Stocking of fridges, shelves, and more",
                    "Organizing storage areas",
                    "Receiving deliveries",
                    "Making coffee to the high standards held by Renwick Hospitality Group",
                    "Greeting guests in and out of the food & beverage areas",
                  ],
                },
              ],
              related_links: [
                {
                  link: "https://www.google.com/search?sca_esv=585281359&q=The+Alderman+NYC&sa=X&ved=0ahUKEwjP1dyD29-CAxXilGoFHWvdDyEQmJACCNQJ",
                  text: "See web results for The Alderman NYC",
                },
              ],
              thumbnail:
                "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSybrHYEk9nLPEWYIZZZwhAGkj7MOcjiGGrZ66aQb4&s",
              extensions: [
                "3 days ago",
                "20 an hour",
                "Full-time",
                "No degree mentioned",
              ],
              detected_extensions: {
                posted_at: "3 days ago",
                schedule_type: "Full-time",
                salary: "20 an hour",
              },
              job_id:
                "eyJqb2JfdGl0bGUiOiJCYXJpc3RhIiwiaHRpZG9jaWQiOiJ0VHN1UE03M3ZHUE01a080QUFBQUFBPT0iLCJobCI6ImVuIiwiZmMiOiJFb3dDQ3N3QlFVeFBibkJaVlhCNFlWSlhVM2RwYkhCNk1WUnpjaTFUVkVOQmFVRk9hemM0WXpOUFgwcHNjbFJOWm5JMFZVc3RkalZ2YVhObmJFNTBUR1JPTjJjemQzRm9YMEZSVlRSVE1XRkxjR1ZaV1ROU1dsQmlRa3hqUVhwa1oyMTJXVFEyY0daQk1uZE5iVEIyTXpsSlZrWXdPVFIyVFZaamRYWkNiRTFSWms5ZldXd3daVFU1YkhKMlpXaHlORkJ0TldWSFRWVkNkVUkwVDJORFREZGxUV0pWYVZCcmMzRmhaRVpNTTJveVZrbFRZVXAxUjIwdFNtTmplak5PWVhaTGJEYzJOVlphVjBkM2JIVnplVWRORWhkdmVrNXBXbGxmTkU1UFMzQnhkSE5RTmpkeFgybEJTUm9pUVVwM2F5MDRaSGRZVVhaQk1uUnZabHBOUjB4ZmFIRlBOMWxuVDFobGRETkhRUSIsImZjdiI6IjMiLCJmY19pZCI6ImZjXzEiLCJhcHBseV9saW5rIjp7InRpdGxlIjoiLm5GZzJlYntmb250LXdlaWdodDo1MDB9LkJpNkRkY3tmb250LXdlaWdodDo1MDB9QXBwbHkgZGlyZWN0bHkgb24gQ3VsaW5hcnkgQWdlbnRzIiwibGluayI6Imh0dHBzOi8vY3VsaW5hcnlhZ2VudHMuY29tL2pvYnMvNTI4MzM0LUJhcmlzdGE/dXRtX2NhbXBhaWduPWdvb2dsZV9qb2JzX2FwcGx5XHUwMDI2dXRtX3NvdXJjZT1nb29nbGVfam9ic19hcHBseVx1MDAyNnV0bV9tZWRpdW09b3JnYW5pYyJ9fQ==",
            },
            {
              title: "Barista | New York City",
              company_name: "Blank Street",
              location: "  New York, NY   ",
              via: "via Greenhouse",
              description:
                "About Blank Street\n\nAt Blank Street, we believe great coffee should be an everyday ritual. With shops across Brooklyn, Manhattan, Boston, DC, and London, we’re the first-ever brand to offer affordable high-quality coffee. Blank Street originated in an effort to change the specialty coffee status quo. Starting with small-format shops and continuing with a limited menu and top-of-the-line tech... we’ve always been focused on simplifying the coffee experience. We partner with amazing local vendors and brands, and have some of the best baristas out there on our team. Love coffee and customer service? Keep reading.\n\nWhat's Brewing...\n\nBaristas at Blank Street must be able to work independently, while also thriving in a team environment. The right person for this role is a proven people-person, taking pride in giving amazing service experiences. You are customer centric and believe in serving a carefully curated menu with passion and precision, making every effort to give your customers exactly what they need, every day, in their way.\n\nOur Values\n• Magic is in the Details: in everything we do we value attention to detail, going the extra mile & thinking about everything that makes a moment meaningful\n• Move as One: We look for inclusive and respectful team members who strive to be the best team player & who over-communicates to ensure understanding\n• “My House is your House” Hospitality: We look for individuals who welcome guests into the cafe the same way they would invite in a friend, who are obsessed with presentation, making sure our cafes are always clean and welcoming & who provide stellar service, even when things are busy or stressful\n\nWho you are:\n• A friendly and enthusiastic team player with a passion for excellent customer service; you’re always ready to make your customers’ day\n• A reliable employee who is able to effectively manage time and priorities, including during busy rush periods where a sense of urgency is necessary\n• Passionate about creating delicious coffee and other cafe beverages\n• A strong independent problem solver with proven multi-tasking and communication skills\n• Someone who is curious, adaptable and always willing to learn\n• Comfortable working in a team or independently\n• Comfortable with cash-handling and maintaining store safety\n\nWhat you'll own:\n• Delight our customers with consistent, welcoming and engaging customer service, taking the opportunity to turn every customer into a regular\n• Work within a world-class coffee program using the best coffee equipment (the eversys cameos and shotmasters) and product in the industry to prepare the tastiest drinks\n• Complete all training to ensures proper measures are in place to achieve the correct handling of food and beverage to retain its freshness and quality\n• Have systems in place to avoid wastage of product with both food and beverage, following and adjusting par levels where needed in line with business peaks and lows\n• Maintains NYC Department of Health and Mental Hygiene (DOH) standards at all times\n• Full and complete knowledge and adherence to all product, service and brand training playbooks\n• Participates in all initiatives with the Operations and marketing teams to increase foot traffic, new customers, daily sales, and operational profitability and develop a loyal neighborhood customer base\n\nRequirements:\n• Experience in the customer service or hospitality industry\n• 18+ years of age\n• Able to lift 25+ lbs, and to stand for long periods of time\n• Availability that meets the needs of our cafes\n• Part Time: 15-25 hours per week, 3 days per week. You must be able to work 2 peak days (Friday, Saturday, and/or Sunday)\n• Full Time: 30-40 hours per week, 4-5 days per week. You must be able to work 2 peak days (Friday, Saturday, and/or Sunday)\n• Weekend and holiday availability preferred\n• You must be authorized to work in the U.S.: upon acceptance of a job offer and completion of the Form I-9 with acceptable documents, Blank Street will provide the federal government with employees’ Form I-9 information to confirm authorization to work in the U.S. (a process known as ”E-Verify”).\n\nPerks:\n• $16.50-$17.50/ hour starting + tips\n• Barista accreditation/ training program\n• Paid sick time\n• As a growing company we have opportunities for advancement for those interested\n\nApplication & Interview Process:\n• Application Review\n• Hiring Manager In Person Interview\n• Offer\n\nIf you have 2+ years’ experience in a customer service leadership position and are interested in a shift leader position, check out the application here",
              job_highlights: [
                {
                  title: "Qualifications",
                  items: [
                    "A friendly and enthusiastic team player with a passion for excellent customer service; you’re always ready to make your customers’ day",
                    "A reliable employee who is able to effectively manage time and priorities, including during busy rush periods where a sense of urgency is necessary",
                    "Passionate about creating delicious coffee and other cafe beverages",
                    "A strong independent problem solver with proven multi-tasking and communication skills",
                    "Someone who is curious, adaptable and always willing to learn",
                    "Comfortable working in a team or independently",
                    "Comfortable with cash-handling and maintaining store safety",
                    "Experience in the customer service or hospitality industry",
                    "18+ years of age",
                    "Able to lift 25+ lbs, and to stand for long periods of time",
                    "Availability that meets the needs of our cafes",
                    "You must be able to work 2 peak days (Friday, Saturday, and/or Sunday)",
                    "You must be authorized to work in the U.S.: upon acceptance of a job offer and completion of the Form I-9 with acceptable documents, Blank Street will provide the federal government with employees’ Form I-9 information to confirm authorization to work in the U.S. (a process known as ”E-Verify”)",
                  ],
                },
                {
                  title: "Responsibilities",
                  items: [
                    "Delight our customers with consistent, welcoming and engaging customer service, taking the opportunity to turn every customer into a regular",
                    "Work within a world-class coffee program using the best coffee equipment (the eversys cameos and shotmasters) and product in the industry to prepare the tastiest drinks",
                    "Complete all training to ensures proper measures are in place to achieve the correct handling of food and beverage to retain its freshness and quality",
                    "Have systems in place to avoid wastage of product with both food and beverage, following and adjusting par levels where needed in line with business peaks and lows",
                    "Full and complete knowledge and adherence to all product, service and brand training playbooks",
                    "Participates in all initiatives with the Operations and marketing teams to increase foot traffic, new customers, daily sales, and operational profitability and develop a loyal neighborhood customer base",
                  ],
                },
                {
                  title: "Benefits",
                  items: [
                    "Weekend and holiday availability preferred",
                    "$16.50-$17.50/ hour starting + tips",
                    "Barista accreditation/ training program",
                    "Paid sick time",
                    "As a growing company we have opportunities for advancement for those interested",
                  ],
                },
              ],
              related_links: [
                {
                  link: "http://www.blankstreet.com/",
                  text: "blankstreet.com",
                },
                {
                  link: "https://www.google.com/search?sca_esv=585281359&q=Blank+Street&sa=X&ved=0ahUKEwjP1dyD29-CAxXilGoFHWvdDyEQmJACCKUK",
                  text: "See web results for Blank Street",
                },
              ],
              thumbnail:
                "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSji-Iud0kG1yMoPon4-FcdxoVSzqlKB4Zhd2zymD4&s",
              extensions: [
                "Full-time and Part-time",
                "No degree mentioned",
                "Paid time off",
              ],
              detected_extensions: {
                schedule_type: "Full-time and Part-time",
              },
              job_id:
                "eyJqb2JfdGl0bGUiOiJCYXJpc3RhIHwgTmV3IFlvcmsgQ2l0eSIsImh0aWRvY2lkIjoiRmtCZkJMSTBmbVlDaXhRbkFBQUFBQT09IiwiaGwiOiJlbiIsImZjIjoiRXFJQ0N1SUJRVXhQYm5CWlZWUndlV1ZoYUMxWWRGbE1Xa0pUUmtWbVJqVTBSRGx4ZVZkclUyTlVNSFJ0Y2xaS2RVMXdablptWWxvemVrbFpSbkJCWjFFdE1YVm5RemhhZGxORFFUTllRM0EzV0c5UldYTlVibE10UWxoVmJXbElNV3RqYlRGMU1YazJVSGxpWDIxWFJVcFhOSEZ4UVhnd2VGQjZlVE5WTlRnNU1URnhTM05NUTNka1dGSlhTalZrVFY5NlgyMVpWMlpMWWpSelZFZHhZMWs1VFdoMUxVTldUbFpUVDNaSWRsZHNNVmRPYldkYWRsb3pXVTB5TVZWb0xUVmtUMGhGYW5oRVYwZFJVVUk0YW14YVJYa3hiMk5qVDFSbGRXbDFaVEpVWjJoSlpEUk9VUklYYjNwT2FWcFpYelJPVDB0d2NYUnpVRFkzY1Y5cFFVa2FJa0ZLZDJzdE9HVjZjakJPWkVWRlNYRlRVSFV6UkRWWVdFbERNbTB5U0VaSWJVRSIsImZjdiI6IjMiLCJmY19pZCI6ImZjXzIiLCJhcHBseV9saW5rIjp7InRpdGxlIjoiQXBwbHkgb24gR3JlZW5ob3VzZSIsImxpbmsiOiJodHRwczovL2JvYXJkcy5ncmVlbmhvdXNlLmlvL2JsYW5rc3RyZWV0L2pvYnMvNDc0MDQ3NDAwMz91dG1fY2FtcGFpZ249Z29vZ2xlX2pvYnNfYXBwbHlcdTAwMjZ1dG1fc291cmNlPWdvb2dsZV9qb2JzX2FwcGx5XHUwMDI2dXRtX21lZGl1bT1vcmdhbmljIn19",
            },
            {
              title: "Barista",
              company_name: "Urbanspace NYC",
              location: "  New York, NY   ",
              via: "via ZipRecruiter",
              description:
                "Position: Barista\n\nReports To: Management...\n\nWage: $18\n\nFLSA Status: Non- Exempt\n\nJOB DESCRIPTION\n\nExperience: Minimum of 3 years of experience in a comparable position. Professional appearance, (No headphones, hats, or loose pants), excellent interpersonal and communication skills.\n\nRole & Responsibilities:\nPrepare coffee bar and keep it well stocked with ice, mixers, condiments, napkins, straws, glassware, and utensils.\nProtect establishment and patrons by adhering to sanitation, safety and organization\nPrepare and sell coffee drinks by following recipes and preparation techniques for coffee drinks\nCreate a positive guest experience by guiding guests through the menu, recommending drinks, etc.\nMaintain a thorough understanding of all menu items and is able to answer questions regarding drink items and their preparation\nUse Clover quickly and in proper sequence according to standard, receiving and executing coffee bar orders, identifying patrons' needs and special requests\nMaintain coffee bar setting by removing empty glasses as completed, replenishing utensils, replenishing beverages, refilling water glasses, being alert to patron spills or other special needs\nEnsure consistently clean cups/glasses, bar equipment and working areas\n\nMaintain inventories by replenishing coffee bean supply, maintaining supplies, etc.\nDeliver an amazing guest experience\nDrive sales and promote the brand\nFollow portion guidelines to ensure cost control, while maximizing the Guest experience\nEnsure all financial transactions are accurate by operating credit card machines correctly, calculating and returning appropriate change\nMust demonstrate ability to operate Clover, make changes, accurately conduct credit card transactions, and account of all monies at the end of each shift\n\nSkills and Knowledge: Verbal Communication, Customer Service, Resolving Conflict, Teamwork, Persistence, Professionalism\n\nPhysical abilities: Must be able to lift and carry 60 pounds.\nMust be able to stand, walk, lift, and bend for long periods of time.\n\nDress Attire: Dark blue wash fitted jeans, Black long sleeve button shirt (black or clear button,) Black non-athletic tennis shoes",
              job_highlights: [
                {
                  title: "Qualifications",
                  items: [
                    "Experience: Minimum of 3 years of experience in a comparable position",
                    "Professional appearance, (No headphones, hats, or loose pants), excellent interpersonal and communication skills",
                    "Must demonstrate ability to operate Clover, make changes, accurately conduct credit card transactions, and account of all monies at the end of each shift",
                    "Skills and Knowledge: Verbal Communication, Customer Service, Resolving Conflict, Teamwork, Persistence, Professionalism",
                    "Physical abilities: Must be able to lift and carry 60 pounds",
                    "Must be able to stand, walk, lift, and bend for long periods of time",
                    "Dress Attire: Dark blue wash fitted jeans, Black long sleeve button shirt (black or clear button,) Black non-athletic tennis shoes",
                  ],
                },
                {
                  title: "Responsibilities",
                  items: [
                    "Reports To: Management",
                    "Prepare coffee bar and keep it well stocked with ice, mixers, condiments, napkins, straws, glassware, and utensils",
                    "Protect establishment and patrons by adhering to sanitation, safety and organization",
                    "Prepare and sell coffee drinks by following recipes and preparation techniques for coffee drinks",
                    "Create a positive guest experience by guiding guests through the menu, recommending drinks, etc",
                    "Maintain a thorough understanding of all menu items and is able to answer questions regarding drink items and their preparation",
                    "Use Clover quickly and in proper sequence according to standard, receiving and executing coffee bar orders, identifying patrons' needs and special requests",
                    "Maintain coffee bar setting by removing empty glasses as completed, replenishing utensils, replenishing beverages, refilling water glasses, being alert to patron spills or other special needs",
                    "Ensure consistently clean cups/glasses, bar equipment and working areas",
                    "Maintain inventories by replenishing coffee bean supply, maintaining supplies, etc",
                    "Deliver an amazing guest experience",
                    "Drive sales and promote the brand",
                    "Follow portion guidelines to ensure cost control, while maximizing the Guest experience",
                    "Ensure all financial transactions are accurate by operating credit card machines correctly, calculating and returning appropriate change",
                  ],
                },
                {
                  title: "Benefits",
                  items: ["Wage: $18"],
                },
              ],
              related_links: [
                {
                  link: "https://www.google.com/search?sca_esv=585281359&q=Urbanspace+NYC&sa=X&ved=0ahUKEwjP1dyD29-CAxXilGoFHWvdDyEQmJACCPAK",
                  text: "See web results for Urbanspace NYC",
                },
              ],
              extensions: ["22 days ago", "Full-time", "No degree mentioned"],
              detected_extensions: {
                posted_at: "22 days ago",
                schedule_type: "Full-time",
              },
              job_id:
                "eyJqb2JfdGl0bGUiOiJCYXJpc3RhIiwiaHRpZG9jaWQiOiJJLTAwNF9Cek1qMVRhWk5QQUFBQUFBPT0iLCJobCI6ImVuIiwiZmMiOiJFdmNCQ3JjQlFVeFBibkJaVmpNNGVFbHZSak5zVjAxSVNVNW5hRFpRYURSMmJEbHFZbUl3YTBwVGNtaGhaR1p5WVd4dWIyZ3lNek4xY3pCVFMybG1kak41WkVwMWNGZE9hV3BDVFZVMlpWVTVObEpvYlc0NGVFUTNhR05vZDJoYWJqSkxNbTQyYzAxT1YzZGFNRFpVWlhWV1VsTnpaR1JyVURFMWQxTnRTRWhKVm1aUlRVTkJSV28xTjNRMGQwaFVXSFpJVmpaeWRUSjJkRk5OWkZCblJsUlVVbWhLZVRCU1ZtOXFaVko2V25OVVlXbGFVbTVuYTJ0eVNGTlZFaGR2ZWs1cFdsbGZORTVQUzNCeGRITlFOamR4WDJsQlNSb2lRVXAzYXkwNFpUQkxNV1ZPYm1sWGJGQTJPWEpLVVZScFVWVnlTMDlQTVcxTGR3IiwiZmN2IjoiMyIsImZjX2lkIjoiZmNfNCIsImFwcGx5X2xpbmsiOnsidGl0bGUiOiJBcHBseSBkaXJlY3RseSBvbiBaaXBSZWNydWl0ZXIiLCJsaW5rIjoiaHR0cHM6Ly93d3cuemlwcmVjcnVpdGVyLmNvbS9jL1VyYmFuc3BhY2UtTllDL0pvYi9CYXJpc3RhLy1pbi1OZXctWW9yayxOWT9qaWQ9YmJlYjE3MTUzYmFiMWRlZFx1MDAyNnV0bV9jYW1wYWlnbj1nb29nbGVfam9ic19hcHBseVx1MDAyNnV0bV9zb3VyY2U9Z29vZ2xlX2pvYnNfYXBwbHlcdTAwMjZ1dG1fbWVkaXVtPW9yZ2FuaWMifX0=",
            },
            {
              title: "Barista",
              company_name: "Farm.One",
              location: "  New York, NY   ",
              via: "via LinkedIn",
              description:
                "Farm.One is an urban indoor vertical farming company that grows a wide variety of specialty greens, herbs and edible flowers using hydroponic and controlled environment methods. Emphasizing a retail-oriented approach, we cater to high-end restaurants and retail consumers, host public and private events, and have recently opened a non-alcoholic bar concept, The Brew Lab. This new concept features... a selection of over 60 craft beers, classic cocktails, and wines, all sans alcohol. The combination of an indoor vertical farm with a non-alcoholic bar concept provides a truly unique and non-replicable experience for customers.\n\nOver the coming months, once approved and properly licensed, the Brew Lab will add an onsite brewery that will serve farm-inspired alcoholic craft beer. The goal is to seamlessly blend the alcohol / non-alcohol social scene into one amazing experience in a way that only Farm.One can do.\n\nRequirements\n\nJob Overview\n\nWe're looking for a dynamic Beverage Barista to join our team. In this role, you'll be the face of our unique bar experience, crafting exceptional non-alcoholic beverages and ensuring every customer's visit is memorable. If you have a flair for mixology, a love for local produce, and a commitment to excellent customer service, this is the perfect opportunity for you!\n\nKey Responsibilities\n• Beverage Preparation & Innovation:\n• Prepare a range of non-alcoholic beverages with precision and creativity\n• Maintain cleanliness and functionality of bar equipment\n• Customer Experience\n• Provide a welcoming, engaging, and informative customer experience\n• Educate customers about our unique ingredients and non-alcoholic beverages\n• Handle customer inquiries and feedback with professionalism and care\n• Sales & POS Operations: Toast\n• Efficiently manage transactions using our Point of Sale (POS) system\n• Manage inventory and report on stock levels\n• Team Collaboration & Learning\n• Work collaboratively with the team to ensure a seamless operation\n• Opportunities to also work our public and private events.\n• Contribute to a positive and dynamic team environment\n\nQualifications\n• 2+ years experience as a barista or in a similar role\n• Knowledge of, or a strong interest in, beverages and mixology is a plus\n• NYC Food Handlers Card is also a plus\n• Excellent communication and interpersonal skills\n• Ability to work efficiently in a fast-paced environment\n• Flexibility to work Thursday through Sunday part-time each week (shift hours are 2:30pm to 8:30pm Thursday and Friday and 12:30pm to 8:30pm Saturday and Sunday)\n\nBenefits\n\nWhat We Offer\n• A unique, vibrant and team-oriented work environment\n• Opportunity to work with rare and unique ingredients\n• Competitive hourly wage ($18 per hour)\n• Approximately 30 hrs/wk, option to work additional private events. Closed holidays\n• Opportunities for professional growth and learning",
              job_highlights: [
                {
                  title: "Qualifications",
                  items: [
                    "2+ years experience as a barista or in a similar role",
                    "Excellent communication and interpersonal skills",
                    "Ability to work efficiently in a fast-paced environment",
                    "Flexibility to work Thursday through Sunday part-time each week (shift hours are 2:30pm to 8:30pm Thursday and Friday and 12:30pm to 8:30pm Saturday and Sunday)",
                  ],
                },
                {
                  title: "Responsibilities",
                  items: [
                    "Beverage Preparation & Innovation:",
                    "Prepare a range of non-alcoholic beverages with precision and creativity",
                    "Maintain cleanliness and functionality of bar equipment",
                    "Provide a welcoming, engaging, and informative customer experience",
                    "Educate customers about our unique ingredients and non-alcoholic beverages",
                    "Handle customer inquiries and feedback with professionalism and care",
                    "Sales & POS Operations: Toast",
                    "Efficiently manage transactions using our Point of Sale (POS) system",
                    "Manage inventory and report on stock levels",
                    "Team Collaboration & Learning",
                    "Work collaboratively with the team to ensure a seamless operation",
                    "Opportunities to also work our public and private events",
                    "Contribute to a positive and dynamic team environment",
                  ],
                },
                {
                  title: "Benefits",
                  items: [
                    "A unique, vibrant and team-oriented work environment",
                    "Opportunity to work with rare and unique ingredients",
                    "Competitive hourly wage ($18 per hour)",
                    "Approximately 30 hrs/wk, option to work additional private events",
                    "Opportunities for professional growth and learning",
                  ],
                },
              ],
              related_links: [
                {
                  link: "https://www.google.com/search?sca_esv=585281359&q=Farm.One&sa=X&ved=0ahUKEwjP1dyD29-CAxXilGoFHWvdDyEQmJACCLoL",
                  text: "See web results for Farm.One",
                },
              ],
              thumbnail:
                "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR1i4L4x121EGvm-QieLdYa1ZNDCC4RRPSpObWKCB4&s",
              extensions: ["12 hours ago", "Part-time", "No degree mentioned"],
              detected_extensions: {
                posted_at: "12 hours ago",
                schedule_type: "Part-time",
              },
              job_id:
                "eyJqb2JfdGl0bGUiOiJCYXJpc3RhIiwiaHRpZG9jaWQiOiJubjEzaUlVRWM1R3ZxU2MzQUFBQUFBPT0iLCJobCI6ImVuIiwiZmMiOiJFdmNCQ3JjQlFVeFBibkJaVldWWGIxVXpTV3R6U0RkekxYUnRaM1Y0Y0dSd1ltMXVOa0p4VFRSNlltWXhZbVV5WW1Gd1ZGVlRaMjVEZUZWaWNUTTNXa0p5VkdKcFFuQkRUR05yU1Y5VVdYTkNYM1Y0U2tkNlVGQTFaMnBQWWtOU1pHVnZXakZqV1hWQ2NFWnhaRzUzYWtkNE9VMVpjbFV5WW1OaldWbDNPV1pMTW5aYWJuUkdka0ZQZDBKd1YxVXljRFU1VWxKbWFHa3dPV1JXV1ZaUWNYTXhVRU5DWkVoR1pVeGtTRlZLWTJ4cE1GbEJXRmhWUTNZMlRrOVpFaGR2ZWs1cFdsbGZORTVQUzNCeGRITlFOamR4WDJsQlNSb2lRVXAzYXkwNFprcHljMmhrWldnM2NUaFBkbWxaU2w5Nk4wbGpSQzFLZDNScVFRIiwiZmN2IjoiMyIsImZjX2lkIjoiZmNfNSIsImFwcGx5X2xpbmsiOnsidGl0bGUiOiJBcHBseSBvbiBMaW5rZWRJbiIsImxpbmsiOiJodHRwczovL3d3dy5saW5rZWRpbi5jb20vam9icy92aWV3L2JhcmlzdGEtYXQtZmFybS1vbmUtMzc3Mjg0NzgwND91dG1fY2FtcGFpZ249Z29vZ2xlX2pvYnNfYXBwbHlcdTAwMjZ1dG1fc291cmNlPWdvb2dsZV9qb2JzX2FwcGx5XHUwMDI2dXRtX21lZGl1bT1vcmdhbmljIn19",
            },
            {
              title: "Barista - Full Time",
              company_name: "Blue Bottle Coffee",
              location: "  New York, NY   ",
              via: "via Lever",
              description:
                "At Blue Bottle, our mission is to connect the world to delicious coffee. From seed to cup, we elevate the craft of coffee in everything we do. We strive to build a better tomorrow by investing in what matters: a sustainable future for our people, the company, and our planet.\n\nAbout the Job...\n\nAt Blue Bottle Coffee, a Barista is someone who is passionate about coffee, culinary items, sustainability, and creating incredible guest experiences grounded in care and respect. We invite you to grow as a team member and create community through coffee with us.\n\nYou will\n• Deliver exceptional hospitality to our guests, your fellow teammates, and all of our vendors and suppliers\n• Make and serve a selection of delicious beverages with a variety of different brewing and preparation methods\n• Prepare and serve delicious food\n• Stay knowledgeable about Blue Bottle’s current beverage and food offerings and preparation techniques; continuously cultivating your own curiosity and knowledge through in-house tastings, cuppings, and trainings\n• Taste our Blue Bottle beverages regularly to ensure quality, uphold our standards, and develop your palate\n• Create community in our cafes by sharing your joy and knowledge of coffee with our guests; inspire your fellow teammates to do the same\n• Support your team by taking joy in the tasks that keep the cafe running smoothly and beautifully—these tasks may vary but can include cleaning, clearing and washing dishes, sweeping, dusting, mopping, cleaning and organizing condiment stations, and taking out trash\n• Be passionate about the planet and help us achieve our company-wide sustainability goals\n• Uphold and follow all health, food safety, and safety guidelines\n• Promote a safe and respectful working environment\n\nYou are\n• Searching for a career in food and beverage with a dynamic, growing company\n• Passionate about coffee, food, and creating inclusive hospitality experiences\n• Reliable and consistent—your leader and teammates can always depend on you to be punctual and bring your A game\n• Thoughtful and able to anticipate our guests’ needs\n• Obsessed with the details! You love honing your craft and understand the nourishing powers in each cup of coffee and each plate of delicious food\n• Excited about taking on new experiences and possess a can-do attitude\n• Eligible to work in the United States and 18 years of age or older\n\nYou have\n• Basic math and computer skills\n• A flexible schedule and are available to work mornings, evenings, weekends, and holidays\n\nA few benefits we offer\n• Comprehensive Health, dental, and vision coverage for eligible employees starting on your first day\n• Best-in-class coffee training and continuing education\n• Free membership into Specialty Coffee Association of America and discounts on events (including Expos and Championships)\n• 401(k) plan\n• Paid time off & paid volunteer hours\n• 50% discount on all products, both online and in-cafe. This includes food, beverages, whole bean coffee, and merchandise.\n• 2 free drinks during shifts for cafe team members\n• Flexible spending account & commuter benefits\n• Employee Assistance Program\n\nCompensation\n• Starting at $17.00 per hour + an average of $6 or more per hour in tips and an opportunity to also earn an additional $1 per hour if the cafe hits sales every month (paid out quarterly)\n• Cafe Incentive Program\n• Tips\n\nOur Barista position is a dynamic one! Below we’ve mapped out the physical demands that are essential to the role\n• Ability to stand and walk for long periods of time. You’re on your feet the majority of the day, whether you are standing behind bar pulling shots or walking the cafe floor\n• Use of hands to reach, grip, turn and perform precision work. You’re using your hands to operate beautiful espresso machines, pour delicious pour overs, and operate the register (among other responsibilities)\n• As needed squat, bend, twist and reach for items below waist level or above shoulders. For example, you may have to bend down or reach up to grab cups, lids and towels\n• Ability to lift, push/pull, carry and/or move up to 50 pounds. For example, you’ll be handling bags of coffee beans, coffee kegs, crates of milk, tub of dishes and trash bins\n• As needed climb ladders, stairs, ramps and uneven floor and/or surfaces. For example, climb on a step stool to change menu slacks, go up and down stairs and ramps to storage areas\n• Ability to smell and taste. You’re tasting and smelling coffee and food, helping ensure quality control for each cup and plate\n• Ability to listen and speak. You’re listening and speaking with our guests to take and fill orders, and guide and create experiences\n\nBlue Bottle is an Equal Opportunity Employer. We value an open mind, dedication to work, and a collaborative spirit. We hire based on these qualities, a job’s requirements, our business’s needs, and an applicant’s qualifications. We do not tolerate discrimination or harassment of any kind—in the hiring process or in the workplace.\n\nWe comply with the ADA and provide reasonable accommodations that allow qualified applicants/employees to perform the essential functions of the job. We also provide reasonable religious accommodations to applicants/employees to allow them to practice their bona fide religious beliefs. To request an accommodation, contact your People Partner.\n\nWe may refuse to hire relatives of present employees if doing so could result in actual or potential problems in supervision, security, safety, or morale, or if doing so could other create conflicts of interest.\n\nWe will consider for employment qualified applicants with arrest and conviction records.\n\nWe participate in E-Verify. We will provide the federal government with employees’ Form I-9 information to confirm authorization to work in the U.S. We will only use E-Verify once an employee has accepted a job offer and completed the Form I-9",
              job_highlights: [
                {
                  title: "Qualifications",
                  items: [
                    "Searching for a career in food and beverage with a dynamic, growing company",
                    "Passionate about coffee, food, and creating inclusive hospitality experiences",
                    "Reliable and consistent—your leader and teammates can always depend on you to be punctual and bring your A game",
                    "Thoughtful and able to anticipate our guests’ needs",
                    "Obsessed with the details!",
                    "You love honing your craft and understand the nourishing powers in each cup of coffee and each plate of delicious food",
                    "Excited about taking on new experiences and possess a can-do attitude",
                    "Eligible to work in the United States and 18 years of age or older",
                    "Basic math and computer skills",
                    "Ability to stand and walk for long periods of time",
                    "You’re on your feet the majority of the day, whether you are standing behind bar pulling shots or walking the cafe floor",
                    "As needed squat, bend, twist and reach for items below waist level or above shoulders",
                    "For example, you may have to bend down or reach up to grab cups, lids and towels",
                    "Ability to lift, push/pull, carry and/or move up to 50 pounds",
                    "For example, you’ll be handling bags of coffee beans, coffee kegs, crates of milk, tub of dishes and trash bins",
                    "For example, climb on a step stool to change menu slacks, go up and down stairs and ramps to storage areas",
                    "You’re tasting and smelling coffee and food, helping ensure quality control for each cup and plate",
                    "Ability to listen and speak",
                    "You’re listening and speaking with our guests to take and fill orders, and guide and create experiences",
                  ],
                },
                {
                  title: "Responsibilities",
                  items: [
                    "Deliver exceptional hospitality to our guests, your fellow teammates, and all of our vendors and suppliers",
                    "Make and serve a selection of delicious beverages with a variety of different brewing and preparation methods",
                    "Prepare and serve delicious food",
                    "Stay knowledgeable about Blue Bottle’s current beverage and food offerings and preparation techniques; continuously cultivating your own curiosity and knowledge through in-house tastings, cuppings, and trainings",
                    "Taste our Blue Bottle beverages regularly to ensure quality, uphold our standards, and develop your palate",
                    "Create community in our cafes by sharing your joy and knowledge of coffee with our guests; inspire your fellow teammates to do the same",
                    "Support your team by taking joy in the tasks that keep the cafe running smoothly and beautifully—these tasks may vary but can include cleaning, clearing and washing dishes, sweeping, dusting, mopping, cleaning and organizing condiment stations, and taking out trash",
                    "Be passionate about the planet and help us achieve our company-wide sustainability goals",
                    "Uphold and follow all health, food safety, and safety guidelines",
                    "Promote a safe and respectful working environment",
                    "You’re using your hands to operate beautiful espresso machines, pour delicious pour overs, and operate the register (among other responsibilities)",
                    "As needed climb ladders, stairs, ramps and uneven floor and/or surfaces",
                    "Ability to smell and taste",
                  ],
                },
                {
                  title: "Benefits",
                  items: [
                    "A few benefits we offer",
                    "Comprehensive Health, dental, and vision coverage for eligible employees starting on your first day",
                    "Best-in-class coffee training and continuing education",
                    "Free membership into Specialty Coffee Association of America and discounts on events (including Expos and Championships)",
                    "401(k) plan",
                    "Paid time off & paid volunteer hours",
                    "50% discount on all products, both online and in-cafe",
                    "Flexible spending account & commuter benefits",
                    "Employee Assistance Program",
                    "Starting at $17.00 per hour + an average of $6 or more per hour in tips and an opportunity to also earn an additional $1 per hour if the cafe hits sales every month (paid out quarterly)",
                    "Cafe Incentive Program",
                  ],
                },
              ],
              related_links: [
                {
                  link: "http://bluebottlecoffee.com/",
                  text: "bluebottlecoffee.com",
                },
                {
                  link: "https://www.google.com/search?sca_esv=585281359&q=Blue+Bottle+Coffee&sa=X&ved=0ahUKEwjP1dyD29-CAxXilGoFHWvdDyEQmJACCIwM",
                  text: "See web results for Blue Bottle Coffee",
                },
              ],
              thumbnail:
                "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQKAC7owISG62Lf499_9ARtxmpl9x4efOxEyql0PyqyDIy7gWW5qOLhW64&s",
              extensions: [
                "Full-time",
                "No degree mentioned",
                "Health insurance",
                "Dental insurance",
                "Paid time off",
              ],
              detected_extensions: {
                schedule_type: "Full-time",
              },
              job_id:
                "eyJqb2JfdGl0bGUiOiJCYXJpc3RhIC0gRnVsbCBUaW1lIiwiaHRpZG9jaWQiOiIzWE16QTlWZW93cm1EOVY0QUFBQUFBPT0iLCJobCI6ImVuIiwiZmMiOiJFcUlDQ3VJQlFVeFBibkJaVlhob05FbFZNVVZtT0VkSGRrYzBXSEpHZVVWM2IxRkZha1ZxTkc4eVlUUndkbFpyUzJSWGNXMUxibXRrY1VOa1oyVTBVV0pCWkZoMFdXSnBaMXBOYW14MWJERXpaMkYwY1RVeE0xTkhiSE5WZGpKSU4yUk9iV0phV0RONVUzUXdUM1J1YTFOcWRYRmZNVVZ3WTBKTldFTm1Ua0pCV2xkVk4yZGljM1kwUmtWTk4yeElSRFJVU0Rka1ZYbENlVkZXUlhwc2NrRnZWMXB1UW1Ka2JGQkpNRTh3WmpKWGRUWkhlVXBJWVhkd2RXOVROa0ZCVGtveVNWbE9aRzFtUlV4RFlqSlVVVkpNWlRSSFNsTTRhakpoZW1VNFFrTlVkMDlFWjFNMmR4SVhiM3BPYVZwWlh6Uk9UMHR3Y1hSelVEWTNjVjlwUVVrYUlrRktkMnN0T0daMVF6UkpkbTFsVG1KeVUwRm9ia1Y0Tkd4M1UwbzVObTlsYm5jIiwiZmN2IjoiMyIsImZjX2lkIjoiZmNfNiIsImFwcGx5X2xpbmsiOnsidGl0bGUiOiJBcHBseSBvbiBMZXZlciIsImxpbmsiOiJodHRwczovL2pvYnMubGV2ZXIuY28vYmx1ZWJvdHRsZWNvZmZlZS9kZDgwODM4MC00Nzg5LTQ4ODEtOTQzZC1kYzhmYTFhNThjM2U/dXRtX2NhbXBhaWduPWdvb2dsZV9qb2JzX2FwcGx5XHUwMDI2dXRtX3NvdXJjZT1nb29nbGVfam9ic19hcHBseVx1MDAyNnV0bV9tZWRpdW09b3JnYW5pYyJ9fQ==",
            },
            {
              title: "Food Runner/Barista",
              company_name: "Crosby Street Hotel",
              location: "  New York, NY   ",
              via: "via Indeed",
              description:
                'Back Server\n\nWe are looking for an eager Back Server to join the Crosby Street Hotel team. The ideal candidate will be trained professional that understands how to effectively expedite and server all of our guests needs. He or she will have a passion for food and beverage equally, and understands how to read a guest properly to ensure quality service, leaving a lasting impression and memorable... experience.\n\nGeneral requirements are as follows, but not limited to:\n\n· Maintain high standard of personal hygiene and appearance at all times.\n\n· Ensure high level of communication between the restaurant and kitchen.\n\n· To have a strong knowledge of the food and beverages offered.\n\n· To deliver food and drinks to guests in an efficient and professional manner.\n\n· Able to make coffees, teas, according to company standards.\n\n· To have a full understanding of New York City Health Department standards and regulations.\n\n· Must be open to working AM/PM shifts, week days, weekends and holidays.\n\n· Has a keen sense of attention to detail making sure tables are served and bussed properly.\n\n· Must be able to lift up to 50lbs\n\nSkills:\n\n· Able to work well under pressure during times of high volume service, and multitask effectively.\n\n· Neat and organized on the restaurant floor during service\n\n· Shows a consistent work habit and great work ethic\n\n· Possess the ability to multitask and problem solve\n\n· Able to speak proper and communicate to guests in a professional manner\n\n· Proactive and enthusiastic team player working well others\n\n· Positive personality and with a professional attitude\n\nWork place benefits for all full time employees:\n\n· Vacation & sick days\n\n· Health, dental, vision and life insurance plans\n\n· Competitive pay\n\n· Holiday staff parties and staff appreciation gatherings\n\n· In house uniform dry cleaning service\n\n· Employee meals\n\nCompany Overview\n\n"Hotels should be living things not stuffy institutions" maintain Tim and Kit Kemp, owners of Firmdale Hotels.\n\nThere are eight boutique hotels in London and one in New York. The high standards of excellence and unique townhouse style of decoration have over the years added up to a winning combination. Kit Kemp has designed the interiors of each hotel in her unique personal way which reflects a fresh, modern English style. Firmdale Hotels has received the Queens Award for Enterprise in 2000, 2006 and 2009, recognition of its outstanding achievement to international trade. www.firmdale.com\n\nJob Types: Full-time, Temporary\n\nPay: $11.00 per hour\n\nExpected hours: 35 – 40 per week\n\nBenefits:\n• Dental insurance\n• Flexible schedule\n• Health insurance\n• Paid time off\n• Vision insurance\n\nShift:\n• 8 hour shift\n• Day shift\n• Evening shift\n\nWeekly day range:\n• Monday to Friday\n• Weekends as needed\n\nWork Location: In person',
              job_highlights: [
                {
                  title: "Qualifications",
                  items: [
                    "Must be able to lift up to 50lbs",
                    "Able to work well under pressure during times of high volume service, and multitask effectively",
                    "Neat and organized on the restaurant floor during service",
                    "Shows a consistent work habit and great work ethic",
                    "Possess the ability to multitask and problem solve",
                    "Able to speak proper and communicate to guests in a professional manner",
                    "Proactive and enthusiastic team player working well others",
                    "Positive personality and with a professional attitude",
                  ],
                },
                {
                  title: "Responsibilities",
                  items: [
                    "He or she will have a passion for food and beverage equally, and understands how to read a guest properly to ensure quality service, leaving a lasting impression and memorable experience",
                    "Maintain high standard of personal hygiene and appearance at all times",
                    "Ensure high level of communication between the restaurant and kitchen",
                    "To have a strong knowledge of the food and beverages offered",
                    "To deliver food and drinks to guests in an efficient and professional manner",
                    "Able to make coffees, teas, according to company standards",
                    "Must be open to working AM/PM shifts, week days, weekends and holidays",
                    "8 hour shift",
                  ],
                },
                {
                  title: "Benefits",
                  items: [
                    "Work place benefits for all full time employees:",
                    "Vacation & sick days",
                    "Health, dental, vision and life insurance plans",
                    "Competitive pay",
                    "Holiday staff parties and staff appreciation gatherings",
                    "Pay: $11.00 per hour",
                    "Expected hours: 35 – 40 per week",
                    "Flexible schedule",
                    "Paid time off",
                  ],
                },
              ],
              related_links: [
                {
                  link: "http://www.firmdalehotels.com/new-york/crosby-street-hotel",
                  text: "firmdalehotels.com/new-york/crosby-street-hotel",
                },
                {
                  link: "https://www.google.com/search?sca_esv=585281359&q=Crosby+Street+Hotel&sa=X&ved=0ahUKEwjP1dyD29-CAxXilGoFHWvdDyEQmJACCNsM",
                  text: "See web results for Crosby Street Hotel",
                },
              ],
              extensions: [
                "20 hours ago",
                "11 an hour",
                "Full-time and Temp work",
                "No degree mentioned",
                "Health insurance",
                "Dental insurance",
                "Paid time off",
              ],
              detected_extensions: {
                posted_at: "20 hours ago",
                schedule_type: "Full-time and Temp work",
                salary: "11 an hour",
              },
              job_id:
                "eyJqb2JfdGl0bGUiOiJGb29kIFJ1bm5lci9CYXJpc3RhIiwiaHRpZG9jaWQiOiJfZWp1bXlFdU8yUUhXOG1WQUFBQUFBPT0iLCJobCI6ImVuIiwiZmMiOiJFcUlDQ3VJQlFVeFBibkJaVm1wRk4yTkZaV2htT1RsdmRFUjZTVXBxYVZWUVkyUnZMVmxXUjJnMGJWUjRTMWRxYWtKblRXYzROMWRTU2pKdVpUVlBXR1ZJUzNNNVdtSlRXVE5KT1hWb1kwWlVibWRTT1hZelZHVnpNRWczVmpVNGEwaHphVnBmY0RsM1YwOWZWVkpPTW1aVmQwaDVVVU5QUW1VMmMyTXpXVVIzYm5oWlZrcFZjRkYwWkhvd1FtZENSMmhIWjJkNE0yeFFNa3d6U21wMk9UQmhPVTlpYkdKYVMydGZPR3RSUWtWR05rNTFNbmRGWlZVeU1YUmlSV3B1WmpWM1MzQjJlRGxGYW5CM1dFczJPRlJKWWtvdGVrWmtlWGN3VWpkRlZuSXRaazlQVTFWaGR4SVhiM3BPYVZwWlh6Uk9UMHR3Y1hSelVEWTNjVjlwUVVrYUlrRktkMnN0T0dWSVVqazJkVU50V1dOUE5FazJiM1Z0WXpGQlQxUTVPR0ZuZG1jIiwiZmN2IjoiMyIsImZjX2lkIjoiZmNfOCIsImFwcGx5X2xpbmsiOnsidGl0bGUiOiJBcHBseSBkaXJlY3RseSBvbiBJbmRlZWQiLCJsaW5rIjoiaHR0cHM6Ly93d3cuaW5kZWVkLmNvbS92aWV3am9iP2prPTI5Yjg1MTVjMmI1YTM3OGVcdTAwMjZ1dG1fY2FtcGFpZ249Z29vZ2xlX2pvYnNfYXBwbHlcdTAwMjZ1dG1fc291cmNlPWdvb2dsZV9qb2JzX2FwcGx5XHUwMDI2dXRtX21lZGl1bT1vcmdhbmljIn19",
            },
            {
              title: "Barista - Temporary",
              company_name: "Barnes & Noble",
              location: "  New York, NY   ",
              via: "via ZipRecruiter",
              description:
                "Barnes & Noble has a special place in the community, and this holds true whether you shop in our bookstores or in our Cafes. Baristas make the experience special by welcoming each guest and creating the perfect handcrafted beverages. They are also the first to try and experiment with new roasts and blends. A barista is the first step to a wonderful career, and we have plenty of opportunities for... you to grow with us. If you enjoy sharing your love for coffee, then this could be the perfect position for you.\n\nAs a barista, you provide first class service to our customers with every drink you create and every cookie you bake, ensuring their experience is your top priority. You make the customer experience pleasurable and provide the perfect complement to any book. Your passion for coffee, creating inspiring drinks and your knowledge of the Cafe ensures that customers are delighted by the handcrafted beverages you serve and look forward to coming into the Cafe again and again. An employee in this position can expect an hourly rate starting at $15.00",
              job_highlights: [
                {
                  title: "Responsibilities",
                  items: [
                    "As a barista, you provide first class service to our customers with every drink you create and every cookie you bake, ensuring their experience is your top priority",
                    "You make the customer experience pleasurable and provide the perfect complement to any book",
                  ],
                },
                {
                  title: "Benefits",
                  items: [
                    "An employee in this position can expect an hourly rate starting at $15.00",
                  ],
                },
              ],
              related_links: [
                {
                  link: "http://www.barnesandnoble.com/",
                  text: "barnesandnoble.com",
                },
                {
                  link: "https://www.google.com/search?sca_esv=585281359&q=Barnes+%26+Noble&sa=X&ved=0ahUKEwjP1dyD29-CAxXilGoFHWvdDyEQmJACCKQN",
                  text: "See web results for Barnes & Noble",
                },
              ],
              thumbnail:
                "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT-ggDP1cXjpNBRE4hTL9FpeQOzhoT8mH_sRC3QKjM&s",
              extensions: [
                "1 day ago",
                "15 an hour",
                "Temp work",
                "No degree mentioned",
              ],
              detected_extensions: {
                posted_at: "1 day ago",
                schedule_type: "Temp work",
                salary: "15 an hour",
              },
              job_id:
                "eyJqb2JfdGl0bGUiOiJCYXJpc3RhIC0gVGVtcG9yYXJ5IiwiaHRpZG9jaWQiOiJtV0dWcUV6ZTlhLUZ3RlY5QUFBQUFBPT0iLCJobCI6ImVuIiwiZmMiOiJFcUlDQ3VJQlFVeFBibkJaVjBGWFZFTkdVbFp4YWxaa1ExRkxia2x5TUUxNk1WZzRaMFpqV1hsNGMwWnZOMkp0VmpoUmRERTBMVmd3Tm1Obk1rbEhZUzFyVjJaZk9HcHlXRWhwY2xoeWFYcGFZMEZxWTFweVUyRjRha1pzZDJWSmRFTm1SSFJtT1hWT2JqWkNPV1JsVDJsS1N6TkllVUpSTkVaa1RqZEpTbVpDYWpCWFVuSmFTRmRaUmtKUmNuVnNRbVZJU0Vrd1MyZFRUR3h6U0c5U1NVbzRTblIyWkdWMWRHNVRRbVExYVVZM2VYQkJSRWhGV1d0WVFUQkphV3gyVG5OcVJtcHdZa2QzVkVadk9HVXlaRE0xY1ZGdFlsQlZUWEYzTm5kV1lucE9ORXRQWkRkWFp4SVhiM3BPYVZwWlh6Uk9UMHR3Y1hSelVEWTNjVjlwUVVrYUlrRktkMnN0T0dabVpXeFdlV3hpUVZKUFUwNDVSMWhEYjNseFpEVlBOR2xyYm5jIiwiZmN2IjoiMyIsImZjX2lkIjoiZmNfMTAiLCJhcHBseV9saW5rIjp7InRpdGxlIjoiQXBwbHkgb24gWmlwUmVjcnVpdGVyIiwibGluayI6Imh0dHBzOi8vd3d3LnppcHJlY3J1aXRlci5jb20vYy9CYXJuZXMtXHUwMDI2LU5vYmxlL0pvYi9CYXJpc3RhLVRlbXBvcmFyeS8taW4tTmV3LVlvcmssTlk/amlkPWRiM2UxODRmOTQzMzRlMjlcdTAwMjZ1dG1fY2FtcGFpZ249Z29vZ2xlX2pvYnNfYXBwbHlcdTAwMjZ1dG1fc291cmNlPWdvb2dsZV9qb2JzX2FwcGx5XHUwMDI2dXRtX21lZGl1bT1vcmdhbmljIn19",
            },
            {
              title: "Coffee barista",
              company_name: "Black Fox Coffee",
              location: "  New York, NY   ",
              via: "via Talent.com",
              description:
                "We are seeking Baristas with experience to join our team. If you enjoy a high-energy, faced paced, and dynamic cafe environment, then keep reading.\n\nWe are looking for hospitality-focused folks who love to engage and take care of guests via thoughtful and intentional fast-casual service...\n\nWe take pride in our ability to provide guests with immense information about the coffees and our beverage program generally as well as our curated food offering.\n\nYou should be interested in expanding your knowledge and like to be consistently challenged to learn and stay up-to-date with industry information.\n\nRate $17-19 / hr plus tips (depending on experience)\n\nOpenings across all locations.\n• Minimum 2 years of experience working in a fast-paced, upscale, cafe / specialty coffee environment.\n• NYC Food Handlers Permit\n• Ability to work quickly and efficiently with quality assurance being a constant focus\n• Experience working in a high-volume specialty coffee environment (500+ drinks / day)\n• Pour beautiful dine-in coffees quickly and consistently\n• Passion for providing an exceptional hospitality experience, guests above all else.\n• Upbeat attitude and works well within a small team.\n• Ability to take direction, receive coaching and feedback, and strive to execute at a high level.\n• An enthusiastic love of coffee and food and willingness and ability to learn extensively about the products we serve.\n• Quality-focused, detail-oriented, and reliable\n\nAbout Black Fox :\n\nAs one of NYC’s leading specialty coffee providers for over 6 years, Black Fox Coffee is a progressive organization with a mission to make a remarkably good coffee experience accessible to all.\n\nBlack Fox’s multi-roaster approach provides an unrivaled variety of some of the best coffees from roasters across the World.\n\nOur team is comprised of experienced and enthusiastic hospitality folk from all walks of life, who continue to be excited by coffee and have a passion for making sure guests have an amazing time in-store.\n\nWe offer extensive training in barista skills, sensory development, customer service, and hospitality.\n\nOur team benefits from Vision, Dental Insurance, Paid Time off for full-time staff, 401K, commuter benefits, and discounts.\n\nFull-time (4-5 days) positions available.\n\nWe look forward to hearing from you!\n\nLast updated : 2023-11-22",
              job_highlights: [
                {
                  title: "Qualifications",
                  items: [
                    "NYC Food Handlers Permit",
                    "Ability to work quickly and efficiently with quality assurance being a constant focus",
                    "Experience working in a high-volume specialty coffee environment (500+ drinks / day)",
                    "Upbeat attitude and works well within a small team",
                    "Ability to take direction, receive coaching and feedback, and strive to execute at a high level",
                    "An enthusiastic love of coffee and food and willingness and ability to learn extensively about the products we serve",
                    "Quality-focused, detail-oriented, and reliable",
                  ],
                },
                {
                  title: "Responsibilities",
                  items: [
                    "You should be interested in expanding your knowledge and like to be consistently challenged to learn and stay up-to-date with industry information",
                  ],
                },
                {
                  title: "Benefits",
                  items: [
                    "Rate $17-19 / hr plus tips (depending on experience)",
                    "Our team benefits from Vision, Dental Insurance, Paid Time off for full-time staff, 401K, commuter benefits, and discounts",
                    "Full-time (4-5 days) positions available",
                  ],
                },
              ],
              related_links: [
                {
                  link: "https://blackfoxcoffee.com/",
                  text: "blackfoxcoffee.com",
                },
                {
                  link: "https://www.google.com/search?sca_esv=585281359&q=Black+Fox+Coffee&sa=X&ved=0ahUKEwjP1dyD29-CAxXilGoFHWvdDyEQmJACCO8N",
                  text: "See web results for Black Fox Coffee",
                },
              ],
              extensions: [
                "4 days ago",
                "17–19 an hour",
                "Full-time",
                "No degree mentioned",
                "Health insurance",
                "Dental insurance",
                "Paid time off",
              ],
              detected_extensions: {
                posted_at: "4 days ago",
                schedule_type: "Full-time",
                salary: "17–19 an hour",
              },
              job_id:
                "eyJqb2JfdGl0bGUiOiJDb2ZmZWUgYmFyaXN0YSIsImh0aWRvY2lkIjoiV1ZESld4cVd3MVlIaDFKT0FBQUFBQT09IiwiaGwiOiJlbiIsImZjIjoiRXFJQ0N1SUJRVXhQYm5CWlYxTm1YMHBxT1RsRWIwSTRSMjFrYlhkelNYVmZTblIxY0V3NWNITnNSbkUzTkROS1JsUkRkVzh0Ukc5dlpWUTRkR2RuZDBKMFYxUkROMVYxZW5GU2QwdGpPV0YzWVc5NE5rSkdZalJwUm14bVMwWjBWbVZzZVVRMU5UQTRSVlp2U2tOMVUzTTFOMUJXYWxaUkxVb3hTblJ2YlZKbE4ybHZRakJXU1ZCS1VXbHBWekJPT1haM2RFbE1iamRrWTB0NFRYUkxNV2xKZWtScGFreG9kWFYyVUZaUU4wZFBVR2x4VFZCU1YwUk9aVXBaVGxaQldVcFpOa3hoWTI1SU4zbEdRWFEyWld4b1Ewc3lYM1ZEU25SbGFtMW1RamRxUWtGTlNFMXFkeElYYjNwT2FWcFpYelJPVDB0d2NYUnpVRFkzY1Y5cFFVa2FJa0ZLZDJzdE9HWnZWakpNZDAxcE5VeHJOMHQwY21NemQxSTJSVGh5ZVhkTmRGRSIsImZjdiI6IjMiLCJmY19pZCI6ImZjXzEyIiwiYXBwbHlfbGluayI6eyJ0aXRsZSI6IkFwcGx5IG9uIFRhbGVudC5jb20iLCJsaW5rIjoiaHR0cHM6Ly93d3cudGFsZW50LmNvbS92aWV3P2lkPWVkY2FkNzEzNTc3OVx1MDAyNnV0bV9jYW1wYWlnbj1nb29nbGVfam9ic19hcHBseVx1MDAyNnV0bV9zb3VyY2U9Z29vZ2xlX2pvYnNfYXBwbHlcdTAwMjZ1dG1fbWVkaXVtPW9yZ2FuaWMifX0=",
            },
            {
              title: "Barista",
              company_name: "Legacy Records",
              location: "  New York, NY   ",
              via: "via Culinary Agents",
              description:
                "We are seeking a Barista for our coffee counter and cafe Easy Victor. This is a unique opportunity to become a part, contribute to and learn from a team of experienced and passionate service professionals.\n\nCandidates must be organized, hard-working, self-motivated and skilled communicators with coffee and customer service experience...\n\nWe look forward to hearing from you!\n\nLegacy Records provides equal employment opportunities (EEO) to all employees and applicants for employment without regard to race, color, religion, sex, national origin, age, disability, protected Veteran status or genetics. In addition to federal law requirements, Legacy Records complies with applicable state and local laws governing non-discrimination in employment",
              job_highlights: [
                {
                  title: "Qualifications",
                  items: [
                    "Candidates must be organized, hard-working, self-motivated and skilled communicators with coffee and customer service experience",
                  ],
                },
              ],
              related_links: [
                {
                  link: "https://www.google.com/search?sca_esv=585281359&q=Legacy+Records&sa=X&ved=0ahUKEwjP1dyD29-CAxXilGoFHWvdDyEQmJACCLEO",
                  text: "See web results for Legacy Records",
                },
              ],
              thumbnail:
                "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSmw6c5nV14gZLJ9WxUVKHUNYXDR6BcR-SLTLbRGtw&s",
              extensions: [
                "6 days ago",
                "17 an hour",
                "Part-time",
                "No degree mentioned",
              ],
              detected_extensions: {
                posted_at: "6 days ago",
                schedule_type: "Part-time",
                salary: "17 an hour",
              },
              job_id:
                "eyJqb2JfdGl0bGUiOiJCYXJpc3RhIiwiaHRpZG9jaWQiOiJ6LVcxaHlJNFBPbFpNMWQ2QUFBQUFBPT0iLCJobCI6ImVuIiwiZmMiOiJFdmNCQ3JjQlFVeFBibkJaVjB0d1ZsRlBVSFpVY3psNFozbFdXbHBRUTFOaFdscGZlVEJaVjI5NmFVeHphekUwZW01ZlQyVm9ORmd4V1hOTk1rVnBWVUV5TmxsUWRXUlNhRXBVVUY4MmVrcDBRVVp6ZDNaeE0yUnRhbmxIZVVoMFEwcHpNR05NWkhvMFgxOU9SSHBZZUhCM01WTkZPRnAxYVdZdFYyeE9OM1pzY25oek4yNVNhWGxWTUVsbGQxUmFkR3REUjFOM2VWQjVUVXR3ZUZKYWFGWnFOMkZaVldobVR6WkhURGhKV0d4TldGQnBWRGg1VUhReVUxcDNFaGR2ZWs1cFdsbGZORTVQUzNCeGRITlFOamR4WDJsQlNSb2lRVXAzYXkwNFptazVRV0pEYW5oSFJIQkpWblZzU0hKbGVqRlNaa3AxUW5SeFVRIiwiZmN2IjoiMyIsImZjX2lkIjoiZmNfMTQiLCJhcHBseV9saW5rIjp7InRpdGxlIjoiQXBwbHkgZGlyZWN0bHkgb24gQ3VsaW5hcnkgQWdlbnRzIiwibGluayI6Imh0dHBzOi8vY3VsaW5hcnlhZ2VudHMuY29tL2pvYnMvNTI3NzI3LUJhcmlzdGE/dXRtX2NhbXBhaWduPWdvb2dsZV9qb2JzX2FwcGx5XHUwMDI2dXRtX3NvdXJjZT1nb29nbGVfam9ic19hcHBseVx1MDAyNnV0bV9tZWRpdW09b3JnYW5pYyJ9fQ==",
            },
            {
              title: "Barista Part Time",
              company_name: "Shakespeare & Company",
              location: "  New York, NY   ",
              via: "via ZipRecruiter",
              description:
                "Shakespeare & Co. is looking for a Barista who would like to work in the environment of a bookstore. Must have barista skills, cafe experience, and a NYC food handlers license. . $15.00 / hr plus tips",
              job_highlights: [
                {
                  title: "Qualifications",
                  items: [
                    "Must have barista skills, cafe experience, and a NYC food handlers license. . $15.00 / hr plus tips",
                  ],
                },
              ],
              related_links: [
                {
                  link: "https://www.google.com/search?sca_esv=585281359&q=Shakespeare+%26+Company&sa=X&ved=0ahUKEwjP1dyD29-CAxXilGoFHWvdDyEQmJACCO0O",
                  text: "See web results for Shakespeare & Company",
                },
              ],
              extensions: [
                "4 days ago",
                "15 an hour",
                "Part-time",
                "No degree mentioned",
              ],
              detected_extensions: {
                posted_at: "4 days ago",
                schedule_type: "Part-time",
                salary: "15 an hour",
              },
              job_id:
                "eyJqb2JfdGl0bGUiOiJCYXJpc3RhIFBhcnQgVGltZSIsImh0aWRvY2lkIjoiMEJ2RzZfc1lTd29BWHVKZEFBQUFBQT09IiwiaGwiOiJlbiIsImZjIjoiRXFJQ0N1SUJRVXhQYm5CWlZWZ3hkQzFHUm5sRk1XbFlMVEpuTlV4NFdrUmlRMjFCU2pKRFVtOW1MVXQ1ZFROT2Fub3RhMDR3WVVjM1NXdHFXbk40VEZBMmFWUklZbU0yUVZodWMzQjNUSFF4Y1VoWVJqQmpSRFJRVTFkQlltcHFNWFJ2WTFCdVYwOWxSR2hJYUZWUmRFdHZWRkIxU2w5WE1sRXpXR3BFWTBkblJtZEtSM2xsWm5GdlducHRYMGxMYmpSbE1uRkVOMk55YzI5SVgwcEpVMVpvYnpkMFgwa3lhR2RFUjBFNVVUUnBVQzFEYWtvNU15MVBZMDl3TjI5NVNuaHRhWE50Y0U4M1p6UXRiRVZOVW1wYVdVOUZWVzF5TjBac1psSXhhVVkyT1ZCSVRsTnRaeElYYjNwT2FWcFpYelJPVDB0d2NYUnpVRFkzY1Y5cFFVa2FJa0ZLZDJzdE9HTTRXVzVHVmpoeU4yMHhUMFY2VEZCeVJFZHdlRXRGVVZaSGMxRSIsImZjdiI6IjMiLCJmY19pZCI6ImZjXzE1IiwiYXBwbHlfbGluayI6eyJ0aXRsZSI6IkFwcGx5IGRpcmVjdGx5IG9uIFppcFJlY3J1aXRlciIsImxpbmsiOiJodHRwczovL3d3dy56aXByZWNydWl0ZXIuY29tL2MvU2hha2VzcGVhcmUtXHUwMDI2LUNvbXBhbnkvSm9iL0JhcmlzdGEtUGFydC1UaW1lLy1pbi1OZXctWW9yayxOWT9qaWQ9YmYwZWU3YTU1OGFhZDhhYVx1MDAyNnV0bV9jYW1wYWlnbj1nb29nbGVfam9ic19hcHBseVx1MDAyNnV0bV9zb3VyY2U9Z29vZ2xlX2pvYnNfYXBwbHlcdTAwMjZ1dG1fbWVkaXVtPW9yZ2FuaWMifX0=",
            },
          ],
          chips: [
            {
              type: "Title",
              param: "job_family_1",
              options: [
                {
                  text: "All",
                },
                {
                  text: "Barista",
                  value: "barista",
                },
                {
                  text: "Starbucks barista",
                  value: "starbucks barista",
                },
                {
                  text: "Service",
                  value: "service",
                },
                {
                  text: "Assistant",
                  value: "assistant",
                },
                {
                  text: "Associate",
                  value: "associate",
                },
                {
                  text: "Cafe manager",
                  value: "cafe manager",
                },
                {
                  text: "Food service",
                  value: "food service",
                },
                {
                  text: "Server",
                  value: "server",
                },
                {
                  text: "Supervisor",
                  value: "supervisor",
                },
                {
                  text: "Bar manager",
                  value: "bar manager",
                },
                {
                  text: "Bartender",
                  value: "bartender",
                },
                {
                  text: "Cafe",
                  value: "cafe",
                },
                {
                  text: "Certification",
                  value: "certification",
                },
                {
                  text: "Coffee shop",
                  value: "coffee shop",
                },
                {
                  text: "Employee",
                  value: "employee",
                },
                {
                  text: "Location",
                  value: "location",
                },
                {
                  text: "Professional",
                  value: "professional",
                },
                {
                  text: "Store manager",
                  value: "store manager",
                },
              ],
            },
            {
              type: "Location",
              param: "city",
              options: [
                {
                  text: "All",
                },
                {
                  text: "New York, NY",
                  value: "Owg_06VPwoli_nfhBo8LyA==",
                },
                {
                  text: "East Northport, NY",
                  value: "_SkIqH0l6ImNZknr1h_NvQ==",
                },
                {
                  text: "Yonkers, NY",
                  value: "oa9DCQjAwomi2tikhHOWvg==",
                },
                {
                  text: "Manhasset, NY",
                  value: "QcszC_SIwol0qInu3eXcOA==",
                },
                {
                  text: "New Rochelle, NY",
                  value: "tVa61YmNwomi2n5qO8N6zw==",
                },
                {
                  text: "Newark, NJ",
                  value: "HQ6aMnBTwolz5P7cKty84Q==",
                },
                {
                  text: "West Nyack, NY",
                  value: "vzIgVzbowom-MeUdAm6dcg==",
                },
                {
                  text: "Westbury, NY",
                  value: "v9-ATuCGwonrpf95r4H2HQ==",
                },
                {
                  text: "Commack, NY",
                  value: "mUQsOuMv6IlUyZ67DrT-dg==",
                },
                {
                  text: "New Hyde Park, NY",
                  value: "OfwQ1pJiwolAhmseIHElsA==",
                },
                {
                  text: "Chappaqua, NY",
                  value: "E9o_FD-5wonurSqudUYeSQ==",
                },
                {
                  text: "Garden City, NY",
                  value: "xUU-IzV9womZ1QVzSHrgDg==",
                },
                {
                  text: "Glen Cove, NY",
                  value: "z_V_bxGFwon84T6o2QYuTQ==",
                },
                {
                  text: "Greenvale, NY",
                  value: "J6FzXROGwokKTVapLXZvgg==",
                },
                {
                  text: "Huntington Station, NY",
                  value: "s0mJvOwo6InUFYCweVLtyg==",
                },
                {
                  text: "Levittown, NY",
                  value: "F_y2Oit-wol5Gl0mYT6umw==",
                },
                {
                  text: "Long Beach, NY",
                  value: "yYQBQ_ZvwoljkDvjoW2T0w==",
                },
                {
                  text: "Melville, NY",
                  value: "7wiRxWIp6IlOSlbCn3HqiA==",
                },
                {
                  text: "Mineola, NY",
                  value: "ZSVkNPGHwonF30B16aml6A==",
                },
                {
                  text: "Scarsdale, NY",
                  value: "i6K1fJGTwolLBBA1KH9QDA==",
                },
                {
                  text: "Valley Stream, NY",
                  value: "xQIUa2NkwokxeY18ZE_zWg==",
                },
                {
                  text: "White Plains, NY",
                  value: "2TWj4iKUwols_FsaEAQUVA==",
                },
                {
                  text: "Bellmore, NY",
                  value: "Ax4VKCl5wonSgDT3GxnAHA==",
                },
                {
                  text: "Bethpage, NY",
                  value: "cwVTBxWAwokevAA9AbwGfQ==",
                },
                {
                  text: "Branchburg, NJ",
                  value: "JROUxgGTw4naXdZK7WO3Zg==",
                },
                {
                  text: "Bronxville, NY",
                  value: "J0ZDIKWSwolhVb6ehTpKYw==",
                },
                {
                  text: "Carle Place, NY",
                  value: "hXEFTYOHwolc8QmCc_WerA==",
                },
                {
                  text: "Cold Spring Harbor, NY",
                  value: "ZwwahBEo6InqJmn8CKTRFA==",
                },
                {
                  text: "Deer Park, NY",
                  value: "Q3eS0jQs6IngxyZy5LLO0A==",
                },
                {
                  text: "East Meadow, NY",
                  value: "xRyHMgh-wokSKBTPpQZ8aw==",
                },
                {
                  text: "East Rutherford, NJ",
                  value: "m7SuHghSwomdI6UyO7R0hw==",
                },
                {
                  text: "Eastchester, NY",
                  value: "1YOoSOWSwolAv4tUJPbePA==",
                },
                {
                  text: "Farmingdale, NY",
                  value: "HzVsCLwq6Il7xE8IEuknFQ==",
                },
                {
                  text: "Floral Park, NY",
                  value: "ZUeBVVZiwolhMcVMZLeAFA==",
                },
                {
                  text: "Harrison, NY",
                  value: "RXu0a-mWwomMlCbJwnxsVA==",
                },
                {
                  text: "Hastings-on-Hudson, NY",
                  value: "c_9lkenswonDC3-VRD5oKQ==",
                },
                {
                  text: "Hicksville, NY",
                  value: "u3lvHeKAwomU2kg0LrOA5A==",
                },
                {
                  text: "Island Park, NY",
                  value: "h5KuEkhlwolpZv14rarIjg==",
                },
                {
                  text: "JOHN F KENNEDY AIRPORT, NY",
                  value: "/f2/JOHN F KENNEDY AIRPORT, NY",
                },
                {
                  text: "Jersey City, NJ",
                  value: "3a-_JdJQwonZJc2iE_BJAg==",
                },
                {
                  text: "Kearny, NJ",
                  value: "yTQTE6FWwonnppCL2nSd0g==",
                },
                {
                  text: "Lake Success, NY",
                  value: "mw_55MWJwokxaP7cmnN0UA==",
                },
                {
                  text: "Lindenhurst, NY",
                  value: "kfezFaHU6YlJCsfGN7QHWQ==",
                },
                {
                  text: "Little Falls, NJ",
                  value: "G5Rsv9YBw4ltIAZ8h1W1Dg==",
                },
                {
                  text: "Mamaroneck, NY",
                  value: "x1g4l5CRwolnuqknwgxOyg==",
                },
                {
                  text: "Massapequa, NY",
                  value: "bwHZb2R_wokON4Go9oGsyQ==",
                },
                {
                  text: "Merrick, NY",
                  value: "b_QsaVR5woloHgvL3TUFfw==",
                },
                {
                  text: "Monsey, NY",
                  value: "J3Ea8crJwolU56F6y1LTvQ==",
                },
                {
                  text: "New City, NY",
                  value: "FZyVPQDDwonwIFXZcYIVBw==",
                },
                {
                  text: "North Babylon, NY",
                  value: "A6Uqbf0s6IngvkXL9CEztg==",
                },
                {
                  text: "Nyack, NY",
                  value: "hTF2NBDqwomq9m_ZhPL7oQ==",
                },
                {
                  text: "Ossining, NY",
                  value: "xYF5HsTAwonYdJ6PBDSy-A==",
                },
                {
                  text: "Port Washington, NY",
                  value: "R-9ZrMuIwokMbfly-gaXNg==",
                },
              ],
            },
            {
              type: "Date posted",
              param: "date_posted",
              options: [
                {
                  text: "All",
                },
                {
                  text: "Past day",
                  value: "today",
                },
                {
                  text: "Past 3 days",
                  value: "3days",
                },
                {
                  text: "Past week",
                  value: "week",
                },
                {
                  text: "Past month",
                  value: "month",
                },
              ],
            },
            {
              type: "Requirements",
              param: "requirements",
              options: [
                {
                  text: "All",
                },
                {
                  text: "No degree",
                  value: "no_degree",
                },
                {
                  text: "No experience",
                  value: "no_experience",
                },
                {
                  text: "Under 3 years of experience",
                  value: "years3under",
                },
                {
                  text: "3+ years of experience",
                  value: "years3plus",
                },
              ],
            },
            {
              type: "Type",
              param: "employment_type",
              options: [
                {
                  text: "All",
                },
                {
                  text: "Full-time",
                  value: "FULLTIME",
                },
                {
                  text: "Part-time",
                  value: "PARTTIME",
                },
                {
                  text: "Contractor",
                  value: "CONTRACTOR",
                },
                {
                  text: "Internship",
                  value: "INTERN",
                },
              ],
            },
            {
              type: "Company type",
              param: "industry.id",
              options: [
                {
                  text: "All",
                },
                {
                  text: "Foods & Beverages",
                  value: "/business/naics2007/311",
                },
                {
                  text: "Restaurant",
                  value: "/business/naics2007/722",
                },
                {
                  text: "Retail",
                  value: "/business/naics2007/44",
                },
                {
                  text: "Accommodation",
                  value: "/business/naics2007/721",
                },
                {
                  text: "Textiles & Apparel",
                  value: "/business/naics2007/313",
                },
                {
                  text: "Entertainment",
                  value: "/business/naics2007/71",
                },
                {
                  text: "Education",
                  value: "/business/naics2007/61",
                },
                {
                  text: "Engineering Services",
                  value: "/business/naics2007/5413",
                },
                {
                  text: "Manufacturing",
                  value: "/business/naics2007/31",
                },
                {
                  text: "Staffing",
                  value: "/business/naics2007/5613",
                },
              ],
            },
            {
              type: "Employer",
              param: "organization_mid",
              options: [
                {
                  text: "All",
                },
                {
                  text: "Starbucks",
                  value: "/m/018c_r",
                },
                {
                  text: "The Cheesecake Factory",
                  value: "/m/04n2g7",
                },
                {
                  text: "Compass Group",
                  value: "/m/05s08r",
                },
                {
                  text: "Dunkin' Donuts",
                  value: "/m/02ccc5",
                },
                {
                  text: "Macys",
                  value: "/m/01pf21",
                },
                {
                  text: "Ralph Lauren",
                  value: "/m/04lg33",
                },
                {
                  text: "Barnes & Noble",
                  value: "/m/01b7dt",
                },
                {
                  text: "Aramark",
                  value: "/m/02twx1",
                },
                {
                  text: "Blank Street",
                  value: "/g/11jytwwnpl",
                },
                {
                  text: "Blue Bottle Coffee",
                  value: "/m/03p12qd",
                },
                {
                  text: "Pret a Manger",
                  value: "/m/046d1c",
                },
                {
                  text: "Black Fox Coffee",
                  value: "/g/11pz17bpqw",
                },
                {
                  text: "Bluestone Lane",
                  value: "/g/11fv60cnz5",
                },
                {
                  text: "Compass Group, North America",
                  value: "/g/11bc6ld96b",
                },
                {
                  text: "Eataly",
                  value: "/m/0dlk40j",
                },
                {
                  text: "Flik Hospitality Group",
                  value: "/g/11f01gjxbg",
                },
                {
                  text: "OTG Management",
                  value: "/m/0120x6z9",
                },
                {
                  text: "TARGET",
                  value: "/m/01b39j",
                },
                {
                  text: "Jack's stir brew",
                  value: "/m/0bwm4yd",
                },
                {
                  text: "16 Handles",
                  value: "/m/0zng203",
                },
                {
                  text: "Aman",
                  value: "/m/03npx82",
                },
                {
                  text: "Aritzia LP",
                  value: "/m/02vs4g2",
                },
                {
                  text: "Bakehouse Factory",
                  value: "/g/11ghq22xws",
                },
              ],
            },
          ],
        };
        // const getText = async () => {
        //   const text = await getJson({
        //     engine: "google_jobs",
        //     q: "barista+New+york",
        //     api_key: process.env.SERPAPI_KEY,
        //     hl: "en",
        //   });
        //   console.log("yay", text);
        //   return text;
        // };

        // const jobs = await getText();
        const jobs = text;
        let html = "";
        console.log("-->", jobs);
        for (let i = 0; i < 10; i++) {
          html = html + "<h1>" + text.jobs_results[i].title + "</h1>";
          html = html + "<h2>" + text.jobs_results[i].location + "</h2>";
          html = html + "<h3>" + text.jobs_results[i].company_name + "</h3>";
          html = html + "<p>" + text.jobs_results[i].description + "</p>";
          console.log("loop done", html);
        }

        const msg = {
          to: "lawrencerobote@gmail.com", // Change to dynamic email
          from: "dev.obote@gmail.com", // Change to your verified sender
          subject: "Here are your job listings",
          text: "and easy to do anywhere, even with Node.js",
          html: html,
        };

        sgMail.send(msg).then(
          () => {},
          (error) => {
            console.error(error);

            if (error.response) {
              console.error(error.response.body);
            }
          }
        );
      },
      { noAck: true }
    );

    console.log(" [*] Waiting for messages. To exit press CTRL+C");
  } catch (err) {
    console.warn(err);
  }
})();
