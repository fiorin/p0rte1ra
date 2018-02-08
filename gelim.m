

clear all

warning off %desabilita msg warning em caso de divisão por zero em sistemas impossíveis ou indeterminados

dummy=0;

disp(' ')

disp(' ')

disp('Este programa calcula a matriz triangularizada a partir da matriz aumentada,')

disp('usando eliminação gaussiana.')

disp('Fornece também os valores das variáveis de sistema representados')

disp('na matriz aumentada.')

disp(' ')

disp('Em caso de um sistema indefinido, a matriz triangularizada será calculada')

disp('e os valores das variáveis do sistema serão representadas por infinitos.')

disp(' ')

[a,r,c]=inputaug(dummy); %nenhum argumento é transmitido à função

for i=2:r %primeiro loop, controla numero de eliminacoes = número de linhas-1

[a,f]=pivot(a,i,r,c);

if f==0 %se flag f = 1, pivô é nulo; passar para coluna seguinte (toda a coluna abaixo já é nula)

for j=i:r %da linha atual até a última

%cada eliminação deve ser feita da linha corrente até a última

m=a(j,i-1)/a(i-1,i-1); %multiplicador

a(j,i-1)=0; %faz elemento igual a zero (eliminacao gaussiana), evitando aproximacoes pela divisão

 

for k=i:c %do elemento linha até o último elemento (coluna) da linha atual

a(j,k)=a(j,k)-m*a(i-1,k); %formula de Gauss

end %next k

end %next j

end %endif

end %next i

 

%Retrosubstituição procedural

x(r)=a(r,c)/a(r,c-1); %primeira substituicao

for i=r-1:-1:1 %linha da retrosubstituicao

x(i)=a(i,c);

for j=c-1:-1:i+1 %coluna da retrosubstituicao

x(i)=x(i)-a(i,j)*x(j);

end

x(i)=x(i)/a(i,i);

end

%Mostrar resultados

disp(' ')

disp('Matriz triangularizada:')

a

disp('Valores das variaveis do sistema:')

x

warning backtrace %reabilita msg warning