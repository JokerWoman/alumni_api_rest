USE sql4405171;

INSERT INTO Genero (id_genero, sexo) VALUES ('1', 'Masculino');
INSERT INTO Genero (id_genero, sexo) VALUES ('2', 'Femenino');
INSERT INTO Genero (id_genero, sexo) VALUES ('3', 'Outro');

-- Adicionar roles dos Alumnis
INSERT INTO Role_Tutor_Embaixador (id_role, descricao) VALUES ('1', 'Embaixador');
INSERT INTO Role_Tutor_Embaixador (id_role, descricao) VALUES ('2', 'Tutor');
INSERT INTO Role_Tutor_Embaixador (id_role, descricao) VALUES ('3', 'Alumni Normal');

-- Adicionar Nacionalidades
INSERT INTO Nacionalidade (id_nacionalidade, paises, nacionalidade) VALUES ('1', 'Portugal', 'português');
INSERT INTO Nacionalidade (id_nacionalidade, paises, nacionalidade) VALUES ('2', 'Venezuela', 'venezuelano');
INSERT INTO Nacionalidade (id_nacionalidade, paises, nacionalidade) VALUES ('3', 'Espanha', 'espanhol');

-- Adicionar Codigo Postal
INSERT INTO CodigoPostal (id_codigoPostal, localidade) VALUES ('4770-440', 'Vila Nova de Famalicão');
INSERT INTO CodigoPostal (id_codigoPostal, localidade) VALUES ('4715-303', 'Nogueiró');
INSERT INTO CodigoPostal (id_codigoPostal, localidade) VALUES ('4300-095', 'Porto');
INSERT INTO CodigoPostal (id_codigoPostal, localidade) VALUES ('4480-004', 'Vila do Conde');

-- Adicionar Skills
INSERT INTO Skills (id_skills, tipoSkill) VALUES ('1', 'Designer');
INSERT INTO Skills (id_skills, tipoSkill) VALUES ('2', 'Programador');
INSERT INTO Skills (id_skills, tipoSkill) VALUES ('3', 'Fotografo');

-- Adicionar professores 
INSERT INTO Professor (id_nroProfessor,password, nome, fotoLink, telemovel,email, id_codigoPostal) VALUES ('1000000','123456789', 'Roberto Fonseca','https://livinlavidarick.files.wordpress.com/2014/03/teacher.jpeg','964328416','roberto@roberto.com','4480-004');
INSERT INTO Professor (id_nroProfessor,password, nome, fotoLink, telemovel,email, id_codigoPostal) VALUES ('2000000','123456789', 'Guilherme Antunes','https://drmarcelodemarzo.com/wp-content/uploads/2020/07/professor-de-matematica-envelhecido-escrevendo-na-lousa_23-2148201011.jpg','914123945','guilherme@guilherme.com','4300-095');

-- Adicionar Empresas
INSERT INTO Empresa (id_empresa,nomeEmpresa, telemovel, morada,email, id_codigoPostal) VALUES('1','Blip','932499526', 'Av. de Camilo 94','communications@blip.pt','4300-095');
INSERT INTO Empresa (id_empresa,nomeEmpresa, telemovel, morada,email, id_codigoPostal) VALUES('2','DesignMasters','913679324', 'Rua da Inovação','communications@designMasters.pt','4480-004');

-- Tipo de emprego
INSERT INTO Tipo_Emprego (id_tipoEmprego, descricao) VALUES ('1', 'Estágio');
INSERT INTO Tipo_Emprego (id_tipoEmprego, descricao) VALUES ('2', 'PartTime');
INSERT INTO Tipo_Emprego (id_tipoEmprego, descricao) VALUES ('3', 'FullTime');

