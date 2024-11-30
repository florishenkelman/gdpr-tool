ALTER TABLE tasks
ALTER COLUMN description TYPE TEXT;

INSERT INTO GDPRArticles (article_number, title, content, keywords) VALUES
('Article 67', 'Exchange of information', 'The Commission may adopt implementing acts of general scope in order to specify the arrangements for the exchange of information by electronic means between supervisory authorities, and between supervisory authorities and the Board, in particular the standardised format referred to in Article 64. Those implementing acts shall be adopted in accordance with the examination procedure referred to in Article 93(2).', ARRAY['information exchange', 'electronic communication', 'supervisory authorities', 'implementing acts']),

('Article 68', 'European Data Protection Board', '1. The European Data Protection Board (the ''Board'') is hereby established as a body of the Union and shall have legal personality. 2. The Board shall be represented by its Chair. 3. The Board shall be composed of the head of one supervisory authority of each Member State and of the European Data Protection Supervisor, or their respective representatives. 4. Where in a Member State more than one supervisory authority is responsible for monitoring the application of the provisions pursuant to this Regulation, a joint representative shall be appointed in accordance with that Member State''s law. 5. The Commission shall have the right to participate in the activities and meetings of the Board without voting right. The Commission shall designate a representative. The Chair of the Board shall communicate to the Commission the activities of the Board. 6. In the cases referred to in Article 65, the European Data Protection Supervisor shall have voting rights only on decisions which concern principles and rules applicable to the Union institutions, bodies, offices and agencies which correspond in substance to those of this Regulation.', ARRAY['EDPB', 'board composition', 'legal personality', 'supervisory authorities', 'representation']),

('Article 69', 'Independence', '1. The Board shall act independently when performing its tasks or exercising its powers pursuant to Articles 70 and 71. 2. Without prejudice to requests by the Commission referred to in point (b) of Article 70(1) and in Article 70(2), the Board shall, in the performance of its tasks or the exercise of its powers, neither seek nor take instructions from anybody.', ARRAY['independence', 'board powers', 'autonomy']),

('Article 70', 'Tasks of the Board', '1. The Board shall ensure the consistent application of this Regulation. To that end, the Board shall, on its own initiative or, where relevant, at the request of the Commission, in particular: monitor and ensure correct application, advise the Commission, issue guidelines and recommendations, examine questions covering application, promote cooperation, and maintain public registers of decisions.', ARRAY['board tasks', 'guidelines', 'recommendations', 'consistency', 'supervision']),

('Article 71', 'Reports', '1. The Board shall draw up an annual report regarding the protection of natural persons with regard to processing in the Union and, where relevant, in third countries and international organisations. The report shall be made public and be transmitted to the European Parliament, to the Council and to the Commission. 2. The annual report shall include a review of the practical application of the guidelines, recommendations and best practices referred to in point (l) of Article 70(1) as well as of the binding decisions referred to in Article 65.', ARRAY['annual report', 'reporting requirements', 'guidelines review', 'transparency']),

('Article 72', 'Procedure', '1. The Board shall take decisions by a simple majority of its members, unless otherwise provided for in this Regulation. 2. The Board shall adopt its own rules of procedure by a two-thirds majority of its members and organise its own operational arrangements.', ARRAY['decision making', 'voting procedures', 'majority rules', 'operational arrangements']),

('Article 73', 'Chair', '1. The Board shall elect a chair and two deputy chairs from amongst its members by simple majority. 2. The term of office of the Chair and of the deputy chairs shall be five years and be renewable once.', ARRAY['chair election', 'deputy chairs', 'term of office', 'board leadership']),

('Article 74', 'Tasks of the Chair', '1. The Chair shall have the following tasks: (a) to convene the meetings of the Board and prepare its agenda; (b) to notify decisions adopted by the Board pursuant to Article 65 to the lead supervisory authority and the supervisory authorities concerned; (c) to ensure the timely performance of the tasks of the Board, in particular in relation to the consistency mechanism referred to in Article 63. 2. The Board shall lay down the allocation of tasks between the Chair and the deputy chairs in its rules of procedure.', ARRAY['chair responsibilities', 'meetings', 'decision notification', 'task allocation']),

('Article 75', 'Secretariat', '1. The Board shall have a secretariat, which shall be provided by the European Data Protection Supervisor. 2. The secretariat shall perform its tasks exclusively under the instructions of the Chair of the Board. 3. The staff of the European Data Protection Supervisor involved in carrying out the tasks conferred on the Board by this Regulation shall be subject to separate reporting lines from the staff involved in carrying out tasks conferred on the European Data Protection Supervisor. 4. Where appropriate, the Board and the European Data Protection Supervisor shall establish and publish a Memorandum of Understanding implementing this Article, determining the terms of their cooperation, and applicable to the staff of the European Data Protection Supervisor involved in carrying out the tasks conferred on the Board by this Regulation. 5. The secretariat shall provide analytical, administrative and logistical support to the Board.', ARRAY['secretariat', 'administrative support', 'EDPS', 'reporting lines', 'cooperation']),

('Article 76', 'Confidentiality', '1. The discussions of the Board shall be confidential where the Board deems it necessary, as provided for in its rules of procedure. 2. Access to documents submitted to members of the Board, experts and representatives of third parties shall be governed by Regulation (EC) No 1049/2001 of the European Parliament and of the Council.', ARRAY['confidentiality', 'document access', 'board discussions', 'transparency']),

('Article 77', 'Right to lodge a complaint with a supervisory authority', '1. Without prejudice to any other administrative or judicial remedy, every data subject shall have the right to lodge a complaint with a supervisory authority, in particular in the Member State of his or her habitual residence, place of work or place of the alleged infringement if the data subject considers that the processing of personal data relating to him or her infringes this Regulation. 2. The supervisory authority with which the complaint has been lodged shall inform the complainant on the progress and the outcome of the complaint including the possibility of a judicial remedy pursuant to Article 78.', ARRAY['complaints', 'data subject rights', 'remedies', 'supervisory authority', 'judicial remedy']);

-- Article 78
INSERT INTO GDPRArticles (article_number, title, content, keywords) VALUES
('Article 78', 'Right to an effective judicial remedy against a supervisory authority',
 '1. Without prejudice to any other administrative or non-judicial remedy, each natural or legal person shall have the right to an effective judicial remedy against a legally binding decision of a supervisory authority concerning them.

2. Without prejudice to any other administrative or non-judicial remedy, each data subject shall have the right to a an effective judicial remedy where the supervisory authority which is competent pursuant to Articles 55 and 56 does not handle a complaint or does not inform the data subject within three months on the progress or outcome of the complaint lodged pursuant to Article 77.

3. Proceedings against a supervisory authority shall be brought before the courts of the Member State where the supervisory authority is established.

4. Where proceedings are brought against a decision of a supervisory authority which was preceded by an opinion or a decision of the Board in the consistency mechanism, the supervisory authority shall forward that opinion or decision to the court.',
 ARRAY['judicial remedy', 'supervisory authority', 'legal proceedings', 'court', 'complaint handling']);

-- Article 79
INSERT INTO GDPRArticles (article_number, title, content, keywords) VALUES
('Article 79', 'Right to an effective judicial remedy against a controller or processor',
 '1. Without prejudice to any available administrative or non-judicial remedy, including the right to lodge a complaint with a supervisory authority pursuant to Article 77, each data subject shall have the right to an effective judicial remedy where he or she considers that his or her rights under this Regulation have been infringed as a result of the processing of his or her personal data in non-compliance with this Regulation.

2. Proceedings against a controller or a processor shall be brought before the courts of the Member State where the controller or processor has an establishment. Alternatively, such proceedings may be brought before the courts of the Member State where the data subject has his or her habitual residence, unless the controller or processor is a public authority of a Member State acting in the exercise of its public powers.',
 ARRAY['judicial remedy', 'controller', 'processor', 'legal proceedings', 'court', 'jurisdiction']);

-- Article 80
INSERT INTO GDPRArticles (article_number, title, content, keywords) VALUES
('Article 80', 'Representation of data subjects',
 '1. The data subject shall have the right to mandate a not-for-profit body, organisation or association which has been properly constituted in accordance with the law of a Member State, has statutory objectives which are in the public interest, and is active in the field of the protection of data subjects'' rights and freedoms with regard to the protection of their personal data to lodge the complaint on his or her behalf, to exercise the rights referred to in Articles 77, 78 and 79 on his or her behalf, and to exercise the right to receive compensation referred to in Article 82 on his or her behalf where provided for by Member State law.

2. Member States may provide that any body, organisation or association referred to in paragraph 1 of this Article, independently of a data subject''s mandate, has the right to lodge, in that Member State, a complaint with the supervisory authority which is competent pursuant to Article 77 and to exercise the rights referred to in Articles 78 and 79 if it considers that the rights of a data subject under this Regulation have been infringed as a result of the processing.',
 ARRAY['representation', 'data subject rights', 'non-profit organizations', 'complaints', 'mandate']);

-- Article 81
INSERT INTO GDPRArticles (article_number, title, content, keywords) VALUES
('Article 81', 'Suspension of proceedings',
 '1. Where a competent court of a Member State has information on proceedings, concerning the same subject matter as regards processing by the same controller or processor, that are pending in a court in another Member State, it shall contact that court in the other Member State to confirm the existence of such proceedings.

2. Where proceedings concerning the same subject matter as regards processing of the same controller or processor are pending in a court in another Member State, any competent court other than the court first seized may suspend its proceedings.

3. Where those proceedings are pending at first instance, any court other than the court first seized may also, on the application of one of the parties, decline jurisdiction if the court first seized has jurisdiction over the actions in question and its law permits the consolidation thereof.',
 ARRAY['legal proceedings', 'jurisdiction', 'suspension', 'court competence', 'cross-border cases']);

-- Article 82
INSERT INTO GDPRArticles (article_number, title, content, keywords) VALUES
('Article 82', 'Right to compensation and liability',
 '1. Any person who has suffered material or non-material damage as a result of an infringement of this Regulation shall have the right to receive compensation from the controller or processor for the damage suffered.

2. Any controller involved in processing shall be liable for the damage caused by processing which infringes this Regulation. A processor shall be liable for the damage caused by processing only where it has not complied with obligations of this Regulation specifically directed to processors or where it has acted outside or contrary to lawful instructions of the controller.

3. A controller or processor shall be exempt from liability under paragraph 2 if it proves that it is not in any way responsible for the event giving rise to the damage.

4. Where more than one controller or processor, or both a controller and a processor, are involved in the same processing and where they are, under paragraphs 2 and 3, responsible for any damage caused by processing, each controller or processor shall be held liable for the entire damage in order to ensure effective compensation of the data subject.

5. Where a controller or processor has, in accordance with paragraph 4, paid full compensation for the damage suffered, that controller or processor shall be entitled to claim back from the other controllers or processors involved in the same processing that part of the compensation corresponding to their part of responsibility for the damage, in accordance with the conditions set out in paragraph 2.

6. Court proceedings for exercising the right to receive compensation shall be brought before the courts competent under the law of the Member State referred to in Article 79(2).',
 ARRAY['compensation', 'liability', 'damages', 'controller responsibility', 'processor responsibility']);

-- Article 83
INSERT INTO GDPRArticles (article_number, title, content, keywords) VALUES
('Article 83', 'General conditions for imposing administrative fines',
 '1. Each supervisory authority shall ensure that the imposition of administrative fines pursuant to this Article in respect of infringements of this Regulation referred to in paragraphs 4, 5 and 6 shall in each individual case be effective, proportionate and dissuasive.

2. Administrative fines shall, depending on the circumstances of each individual case, be imposed in addition to, or instead of, measures referred to in points (a) to (h) and (j) of Article 58(2). When deciding whether to impose an administrative fine and deciding on the amount of the administrative fine in each individual case due regard shall be given to the following:
(a) the nature, gravity and duration of the infringement taking into account the nature scope or purpose of the processing concerned as well as the number of data subjects affected and the level of damage suffered by them;
(b) the intentional or negligent character of the infringement;
(c) any action taken by the controller or processor to mitigate the damage suffered by data subjects;
(d) the degree of responsibility of the controller or processor taking into account technical and organisational measures implemented by them pursuant to Articles 25 and 32;
(e) any relevant previous infringements by the controller or processor;
(f) the degree of cooperation with the supervisory authority, in order to remedy the infringement and mitigate the possible adverse effects of the infringement;
(g) the categories of personal data affected by the infringement;
(h) the manner in which the infringement became known to the supervisory authority, in particular whether, and if so to what extent, the controller or processor notified the infringement;
(i) where measures referred to in Article 58(2) have previously been ordered against the controller or processor concerned with regard to the same subject-matter, compliance with those measures;
(j) adherence to approved codes of conduct pursuant to Article 40 or approved certification mechanisms pursuant to Article 42; and
(k) any other aggravating or mitigating factor applicable to the circumstances of the case, such as financial benefits gained, or losses avoided, directly or indirectly, from the infringement.

3. If a controller or processor intentionally or negligently, for the same or linked processing operations, infringes several provisions of this Regulation, the total amount of the administrative fine shall not exceed the amount specified for the gravest infringement.

4. Infringements of the following provisions shall, in accordance with paragraph 2, be subject to administrative fines up to 10 000 000 EUR, or in the case of an undertaking, up to 2 % of the total worldwide annual turnover of the preceding financial year, whichever is higher:
(a) the obligations of the controller and the processor pursuant to Articles 8, 11, 25 to 39 and 42 and 43;
(b) the obligations of the certification body pursuant to Articles 42 and 43;
(c) the obligations of the monitoring body pursuant to Article 41(4).

5. Infringements of the following provisions shall, in accordance with paragraph 2, be subject to administrative fines up to 20 000 000 EUR, or in the case of an undertaking, up to 4 % of the total worldwide annual turnover of the preceding financial year, whichever is higher:
(a) the basic principles for processing, including conditions for consent, pursuant to Articles 5, 6, 7 and 9;
(b) the data subjects'' rights pursuant to Articles 12 to 22;
(c) the transfers of personal data to a recipient in a third country or an international organisation pursuant to Articles 44 to 49;
(d) any obligations pursuant to Member State law adopted under Chapter IX;
(e) non-compliance with an order or a temporary or definitive limitation on processing or the suspension of data flows by the supervisory authority pursuant to Article 58(2) or failure to provide access in violation of Article 58(1).

6. Non-compliance with an order by the supervisory authority as referred to in Article 58(2) shall, in accordance with paragraph 2 of this Article, be subject to administrative fines up to 20 000 000 EUR, or in the case of an undertaking, up to 4 % of the total worldwide annual turnover of the preceding financial year, whichever is higher.

7. Without prejudice to the corrective powers of supervisory authorities pursuant to Article 58(2), each Member State may lay down the rules on whether and to what extent administrative fines may be imposed on public authorities and bodies established in that Member State.

8. The exercise by the supervisory authority of its powers under this Article shall be subject to appropriate procedural safeguards in accordance with Union and Member State law, including effective judicial remedy and due process.

9. Where the legal system of the Member State does not provide for administrative fines, this Article may be applied in such a manner that the fine is initiated by the competent supervisory authority and imposed by competent national courts, while ensuring that those legal remedies are effective and have an equivalent effect to the administrative fines imposed by supervisory authorities. In any event, the fines imposed shall be effective, proportionate and dissuasive. Those Member States shall notify to the Commission the provisions of their laws which they adopt pursuant to this paragraph by 25 May 2018 and, without delay, any subsequent amendment law or amendment affecting them.',
 ARRAY['administrative fines', 'penalties', 'enforcement', 'infringement', 'supervisory authority', 'compliance', 'sanctions']);

 INSERT INTO GDPRArticles (article_number, title, content, keywords) VALUES
('Article 84', 'Penalties',
 '1. Member States shall lay down the rules on other penalties applicable to infringements of this Regulation in particular for infringements which are not subject to administrative fines pursuant to Article 83, and shall take all measures necessary to ensure that they are implemented. Such penalties shall be effective, proportionate and dissuasive.
2. Each Member State shall notify to the Commission the provisions of its law which it adopts pursuant to paragraph 1, by 25 May 2018 and, without delay, any subsequent amendment affecting them.',
 ARRAY['penalties', 'infringements', 'administrative fines', 'member state obligations', 'enforcement']);

INSERT INTO GDPRArticles (article_number, title, content, keywords) VALUES
('Article 85', 'Processing and freedom of expression and information',
 '1. Member States shall by law reconcile the right to the protection of personal data pursuant to this Regulation with the right to freedom of expression and information, including processing for journalistic purposes and the purposes of academic, artistic or literary expression.
2. For processing carried out for journalistic purposes or the purpose of academic artistic or literary expression, Member States shall provide for exemptions or derogations from Chapter II (principles), Chapter III (rights of the data subject), Chapter IV (controller and processor), Chapter V (transfer of personal data to third countries or international organisations), Chapter VI (independent supervisory authorities), Chapter VII (cooperation and consistency) and Chapter IX (specific data processing situations) if they are necessary to reconcile the right to the protection of personal data with the freedom of expression and information.
3. Each Member State shall notify to the Commission the provisions of its law which it has adopted pursuant to paragraph 2 and, without delay, any subsequent amendment law or amendment affecting them.',
 ARRAY['freedom of expression', 'journalism', 'academic expression', 'artistic expression', 'literary expression', 'derogations']);

INSERT INTO GDPRArticles (article_number, title, content, keywords) VALUES
('Article 86', 'Processing and public access to official documents',
 'Personal data in official documents held by a public authority or a public body or a private body for the performance of a task carried out in the public interest may be disclosed by the authority or body in accordance with Union or Member State law to which the public authority or body is subject in order to reconcile public access to official documents with the right to the protection of personal data pursuant to this Regulation.',
 ARRAY['public access', 'official documents', 'public authority', 'public interest', 'disclosure']);

INSERT INTO GDPRArticles (article_number, title, content, keywords) VALUES
('Article 87', 'Processing of the national identification number',
 'Member States may further determine the specific conditions for the processing of a national identification number or any other identifier of general application. In that case the national identification number or any other identifier of general application shall be used only under appropriate safeguards for the rights and freedoms of the data subject pursuant to this Regulation.',
 ARRAY['national identification', 'identifier processing', 'safeguards', 'data subject rights']);

INSERT INTO GDPRArticles (article_number, title, content, keywords) VALUES
('Article 88', 'Processing in the context of employment',
 '1. Member States may, by law or by collective agreements, provide for more specific rules to ensure the protection of the rights and freedoms in respect of the processing of employees personal data in the employment context, in particular for the purposes of the recruitment, the performance of the contract of employment, including discharge of obligations laid down by law or by collective agreements, management, planning and organisation of work, equality and diversity in the workplace, health and safety at work, protection of employers or customers property and for the purposes of the exercise and enjoyment, on an individual or collective basis, of rights and benefits related to employment, and for the purpose of the termination of the employment relationship.
2. Those rules shall include suitable and specific measures to safeguard the data subjects human dignity, legitimate interests and fundamental rights, with particular regard to the transparency of processing, the transfer of personal data within a group of undertakings, or a group of enterprises engaged in a joint economic activity and monitoring systems at the work place.
3. Each Member State shall notify to the Commission those provisions of its law which it adopts pursuant to paragraph 1, by 25 May 2018 and, without delay, any subsequent amendment affecting them.',
 ARRAY['employment', 'employee data', 'workplace privacy', 'collective agreements', 'worker rights', 'workplace monitoring']);

INSERT INTO GDPRArticles (article_number, title, content, keywords) VALUES
('Article 89', 'Safeguards and derogations relating to processing for archiving purposes in the public interest, scientific or historical research purposes or statistical purposes',
 '1. Processing for archiving purposes in the public interest, scientific or historical research purposes or statistical purposes, shall be subject to appropriate safeguards, in accordance with this Regulation, for the rights and freedoms of the data subject. Those safeguards shall ensure that technical and organisational measures are in place in particular in order to ensure respect for the principle of data minimisation. Those measures may include pseudonymisation provided that those purposes can be fulfilled in that manner. Where those purposes can be fulfilled by further processing which does not permit or no longer permits the identification of data subjects, those purposes shall be fulfilled in that manner.
2. Where personal data are processed for scientific or historical research purposes or statistical purposes, Union or Member State law may provide for derogations from the rights referred to in Articles 15, 16, 18 and 21 subject to the conditions and safeguards referred to in paragraph 1 of this Article in so far as such rights are likely to render impossible or seriously impair the achievement of the specific purposes, and such derogations are necessary for the fulfilment of those purposes.
3. Where personal data are processed for archiving purposes in the public interest, Union or Member State law may provide for derogations from the rights referred to in Articles 15, 16, 18, 19, 20 and 21 subject to the conditions and safeguards referred to in paragraph 1 of this Article in so far as such rights are likely to render impossible or seriously impair the achievement of the specific purposes, and such derogations are necessary for the fulfilment of those purposes.',
 ARRAY['archiving', 'research', 'statistics', 'public interest', 'data minimisation', 'pseudonymisation', 'derogations']);

INSERT INTO GDPRArticles (article_number, title, content, keywords) VALUES
('Article 90', 'Obligations of secrecy', 
 '1. Member States may adopt specific rules to set out the powers of the supervisory authorities laid down in points (e) and (f) of Article 58(1) in relation to controllers or processors that are subject, under Union or Member State law or rules established by national competent bodies, to an obligation of professional secrecy or other equivalent obligations of secrecy where this is necessary and proportionate to reconcile the right of the protection of personal data with the obligation of secrecy. Those rules shall apply only with regard to personal data which the controller or processor has received as a result of or has obtained in an activity covered by that obligation of secrecy.2. Each Member State shall notify to the Commission the rules adopted pursuant to paragraph 1, by 25 May 2018 and, without delay, any subsequent amendment affecting them.', 
 ARRAY['secrecy obligations', 'supervisory authorities', 'professional secrecy', 'data protection']),
 
('Article 91', 'Existing data protection rules of churches and religious associations', 
 '1. Where in a Member State, churches and religious associations or communities apply, at the time of entry into force of this Regulation, comprehensive rules relating to the protection of natural persons with regard to processing, such rules may continue to apply, provided that they are brought into line with this Regulation. 2. Churches and religious associations which apply comprehensive rules in accordance with paragraph 1 of this Article shall be subject to the supervision of an independent supervisory authority, which may be specific, provided that it fulfils the conditions laid down in Chapter VI of this Regulation.', 
 ARRAY['churches', 'religious associations', 'data protection rules', 'independent supervisory authority']),
 
('Article 92', 'Exercise of the delegation', 
 '1. The power to adopt delegated acts is conferred on the Commission subject to the conditions laid down in this Article. 2. The delegation of power referred to in Article 12(8) and Article 43(8) shall be conferred on the Commission for an indeterminate period of time from 24 May 2016. 3. The delegation of power referred to in Article 12(8) and Article 43(8) may be revoked at any time by the European Parliament or by the Council. A decision of revocation shall put an end to the delegation of power specified in that decision. It shall take effect the day following that of its publication in the Official Journal of the European Union or at a later date specified therein. It shall not affect the validity of any delegated acts already in force.4. As soon as it adopts a delegated act, the Commission shall notify it simultaneously to the European Parliament and to the Council. 5. A delegated act adopted pursuant to Article 12(8) and Article 43(8) shall enter into force only if no objection has been expressed by either the European Parliament or the Council within a period of three months of notification of that act to the European Parliament and the Council or if, before the expiry of that period, the European Parliament and the Council have both informed the Commission that they will not object. That period shall be extended by three months at the initiative of the European Parliament or of the Council.', 
 ARRAY['delegated acts', 'delegation of power', 'European Parliament', 'Council', 'notification']),
 
('Article 93', 'Committee procedure', 
 '1. The Commission shall be assisted by a committee. That committee shall be a committee within the meaning of Regulation (EU) No 182/2011. 2. Where reference is made to this paragraph, Article 5 of Regulation (EU) No 182/2011 shall apply. 3. Where reference is made to this paragraph, Article 8 of Regulation (EU) No 182/2011, in conjunction with Article 5 thereof, shall apply.', 
 ARRAY['committee', 'Regulation EU No 182/2011', 'European Commission']),
 
('Article 94', 'Repeal of Directive 95/46/EC', 
 '1. Directive 95/46/EC is repealed with effect from 25 May 2018. 2. References to the repealed Directive shall be construed as references to this Regulation. References to the Working Party on the Protection of Individuals with regard to the Processing of Personal Data established by Article 29 of Directive 95/46/EC shall be construed as references to the European Data Protection Board established by this Regulation.', 
 ARRAY['Directive 95/46/EC', 'repeal', 'European Data Protection Board']),
 
('Article 95', 'Relationship with Directive 2002/58/EC', 
 'This Regulation shall not impose additional obligations on natural or legal persons in relation to processing in connection with the provision of publicly available electronic communications services in public communication networks in the Union in relation to matters for which they are subject to specific obligations with the same objective set out in Directive 2002/58/EC.', 
 ARRAY['Directive 2002/58/EC', 'electronic communications', 'processing obligations']),
 
('Article 96', 'Relationship with previously concluded Agreements', 
 'International agreements involving the transfer of personal data to third countries or international organisations which were concluded by Member States prior to 24 May 2016, and which comply with Union law as applicable prior to that date, shall remain in force until amended, replaced or revoked.', 
 ARRAY['international agreements', 'third countries', 'data transfer']),
 
('Article 97', 'Commission reports', 
 '1. By 25 May 2020 and every four years thereafter, the Commission shall submit a report on the evaluation and review of this Regulation to the European Parliament and to the Council. The reports shall be made public. 2. In the context of the evaluations and reviews referred to in paragraph 1, the Commission shall examine, in particular, the application and functioning of: (a) Chapter V on the transfer of personal data to third countries or international organisations with particular regard to decisions adopted pursuant to Article 45(3) of this Regulation and decisions adopted on the basis of Article 25(6) of Directive 95/46/EC; (b) Chapter VII on cooperation and consistency. 3. For the purpose of paragraph 1, the Commission may request information from Member States and supervisory authorities. 4. In carrying out the evaluations and reviews referred to in paragraphs 1 and 2, the Commission shall take into account the positions and findings of the European Parliament, of the Council, and of other relevant bodies or sources. 5. The Commission shall, if necessary, submit appropriate proposals to amend this Regulation, in particular taking into account of developments in information technology and in the light of the state of progress in the information society.', 
 ARRAY['Commission reports', 'evaluation', 'data protection review', 'regulation amendments']),
 
('Article 98', 'Review of other Union legal acts on data protection', 
 'The Commission shall, if appropriate, submit legislative proposals with a view to amending other Union legal acts on the protection of personal data, in order to ensure uniform and consistent protection of natural persons with regard to processing. This shall in particular concern the rules relating to the protection of natural persons with regard to processing by Union institutions, bodies, offices and agencies and on the free movement of such data.', 
 ARRAY['legislative proposals', 'Union legal acts', 'data protection']),
 
('Article 99', 'Entry into force and application', 
 '1. This Regulation shall enter into force on the twentieth day following that of its publication in the Official Journal of the European Union. 2. It shall apply from 25 May 2018. This Regulation shall be binding in its entirety and directly applicable in all Member States. Done at Brussels, 27 April 2016.', 
 ARRAY['entry into force', 'application date', 'GDPR implementation']);
