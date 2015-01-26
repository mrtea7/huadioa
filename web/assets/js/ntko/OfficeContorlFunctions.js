var OFFICE_CONTROL_OBJ;//控件对象
var IsFileOpened;      //控件是否打开文档
var fileType ;
var fileTypeSimple;

function intializePage(fileUrl)
{
	OFFICE_CONTROL_OBJ=document.getElementById("TANGER_OCX");
	//initCustomMenus();
	NTKO_OCX_OpenDoc(fileUrl);
	/*
	if(!OFFICE_CONTROL_OBJ.IsNTKOSecSignInstalled()||(fileTypeSimple!="word"&&fileTypeSimple!="excel"))
	{   
		document.all("addSecSignFromUrl").disabled = true;
		document.all("addSecSignFromLocal").disabled = true;
		document.all("addSecSignFromEkey").disabled = true;
		document.all("handSecSign").disabled = true;
	}
	if(!OFFICE_CONTROL_OBJ.IsPDFCreatorInstalled())
	{
		document.all("savePdfTOUrl").disabled = true;
	}*/
}
function onPageClose(){
	if(!OFFICE_CONTROL_OBJ.activeDocument.saved){
		if(confirm( "文档修改过,还没有保存,是否需要保存?")){
			saveFileToUrl();
			return false;
		}
	}
	return true;
}
function NTKO_OCX_OpenDoc(fileUrl)
{
	OFFICE_CONTROL_OBJ.BeginOpenFromURL(fileUrl);
}
function setFileOpenedOrClosed(bool)
{
	IsFileOpened = bool;
	fileType = OFFICE_CONTROL_OBJ.DocType ;
}
//删除左右两端的空格
function trim(str){ 
	var result = str.replace(/(^\s*)|(\s*$)/g, "");
	return result;
}

function saveNoTip(){
	
	setShowRevisions(false);//保存时，强制隐藏痕迹
	var myUrl =document.forms[0].action ;
	var fileName = document.all("fileName").value;
	var result  ;
	if(IsFileOpened){
		fileType = "Word.Document";
		result = OFFICE_CONTROL_OBJ.saveToURL(myUrl,//提交到的url地址
			"upLoadFile",//文件域的id，类似<input type=file name=upLoadFile 中的name
			"fileType="+fileType,          //与控件一起提交的参数如："p1=a&p2=b&p3=c"
			fileName,    //上传文件的名称，类似<input type=file 的value
			0    //与控件一起提交的表单id，也可以是form的序列号，这里应该是0.
		);
		result=trim(result);
		document.all("statusBar").innerHTML="服务器返回信息:"+result;
		var paras = result.split('&');
		document.getElementById('fileId').value = paras[1];
		//调用Tab页面的方法
		window.parent.Transfer();
	}
}

function saveFileToUrl(isSilence){
	setShowRevisions(false);//保存时，强制隐藏痕迹
	var myUrl =document.forms[0].action ;
	var fileName = document.all("fileName").value;
	var result  ;
	if(IsFileOpened){
		fileType = "Word.Document";
		result = OFFICE_CONTROL_OBJ.saveToURL(myUrl,//提交到的url地址
			"upLoadFile",//文件域的id，类似<input type=file name=upLoadFile 中的name
			"fileType="+fileType,          //与控件一起提交的参数如："p1=a&p2=b&p3=c"
			fileName,    //上传文件的名称，类似<input type=file 的value
			0    //与控件一起提交的表单id，也可以是form的序列号，这里应该是0.
		);
		result=trim(result);
		document.all("statusBar").innerHTML="服务器返回信息:"+result;
		var paras = result.split('&');
		document.getElementById('fileId').value = paras[1];
        if(!isSilence){
            alert(paras[0]);
        }
		//window.close();
		//保存YW_NWFW表
		//document.actionform.submit();
	}
}
function saveFileAsHtmlToUrl()
{
	var myUrl = "upLoadHtmlFile.jsp"	;
	var htmlFileName = document.all("fileName").value+".html";
	var result;
	if(IsFileOpened)
	{
		result=OFFICE_CONTROL_OBJ.PublishAsHTMLToURL("upLoadHtmlFile.jsp","uploadHtml","htmlFileName="+htmlFileName,htmlFileName);
		result=trim(result);
		document.all("statusBar").innerHTML="服务器返回信息:"+result;
		alert(result);
		window.close();
	}
}
function saveFileAsPdfToUrl()
{
	var myUrl = "upLoadPdfFile.jsp"	;
	var pdfFileName = document.all("fileName").value+".pdf";
	if(IsFileOpened)
	{
		OFFICE_CONTROL_OBJ.PublishAsPdfToURL(myUrl,"uploadPdf","PdfFileName="+pdfFileName,pdfFileName,"","",true,false);
	}
}
function testFunction()
{
	alert(IsFileOpened);
}
function addServerSecSign()
{
	var signUrl=document.all("secSignFileUrl").options[document.all("secSignFileUrl").selectedIndex].value;
	if(IsFileOpened)
	{
		if(OFFICE_CONTROL_OBJ.doctype==1||OFFICE_CONTROL_OBJ.doctype==2)
		{
			try
			{
			alert("正式版本用户请插入EKEY！\r\n\r\n此为电子印章系统演示功能，请购买正式版本！");
			OFFICE_CONTROL_OBJ.AddSecSignFromURL("ntko",signUrl);}
			catch(error){}
		}
		else
		{alert("不能在该类型文档中使用安全签名印章.");}
	}	
}
function addLocalSecSign()
{
	if(IsFileOpened)
	{
		if(OFFICE_CONTROL_OBJ.doctype==1||OFFICE_CONTROL_OBJ.doctype==2)
		{
			try
			{OFFICE_CONTROL_OBJ.AddSecSignFromLocal("ntko","");}
			catch(error){}
		}
		else
		{alert("不能在该类型文档中使用安全签名印章.");}
	}	
}
function addEkeySecSign()
{
	if(IsFileOpened)
	{
		if(OFFICE_CONTROL_OBJ.doctype==1||OFFICE_CONTROL_OBJ.doctype==2)
		{
			try
			{OFFICE_CONTROL_OBJ.AddSecSignFromEkey("ntko");}
			catch(error){}
		}
		else
		{alert("不能在该类型文档中使用安全签名印章.");}
	}
}
function addHandSecSign()
{
	if(IsFileOpened)
	{
		if(OFFICE_CONTROL_OBJ.doctype==1||OFFICE_CONTROL_OBJ.doctype==2)
		{
			try
			{OFFICE_CONTROL_OBJ.AddSecHandSign("ntko");}
			catch(error){}
		}
		else
		{alert("不能在该类型文档中使用安全签名印章.");}
	}
}

function addServerSign(signUrl)
{
	if(IsFileOpened)
	{
			try
			{
				OFFICE_CONTROL_OBJ.AddSignFromURL("ntko",//印章的用户名
				signUrl,//印章所在服务器相对url
				100,//左边距
				100,//上边距 根据Relative的设定选择不同参照对象
				"ntko",//调用DoCheckSign函数签名印章信息,用来验证印章的字符串
				3,  //Relative,取值1-4。设置左边距和上边距相对以下对象所在的位置 1：光标位置；2：页边距；3：页面距离 4：默认设置栏，段落
				100,//缩放印章,默认100%
				1);   //0印章位于文字下方,1位于上方
				
			}
			catch(error){}
	}		
}

function addLocalSign()
{
	if(IsFileOpened)
	{
			try
			{
				OFFICE_CONTROL_OBJ.AddSignFromLocal("ntko",//印章的用户名
					"",//缺省文件名
					true,//是否提示选择
					100,//左边距
					100,//上边距 根据Relative的设定选择不同参照对象
					"ntko",//调用DoCheckSign函数签名印章信息,用来验证印章的字符串
					3,  //Relative,取值1-4。设置左边距和上边距相对以下对象所在的位置 1：光标位置；2：页边距；3：页面距离 4：默认设置栏，段落
					100,//缩放印章,默认100%
					1);   //0印章位于文字下方,1位于上方
			}
			catch(error){}
	}
}
function addPicFromUrl(picURL)
{
	if(IsFileOpened)
	{
		if(OFFICE_CONTROL_OBJ.doctype==1||OFFICE_CONTROL_OBJ.doctype==2)
		{
			try
			{
				OFFICE_CONTROL_OBJ.AddPicFromURL(picURL,//图片的url地址可以时相对或者绝对地址
				false,//是否浮动,此参数设置为false时,top和left无效
				100,//left 左边距
				100,//top 上边距 根据Relative的设定选择不同参照对象
				1,  //Relative,取值1-4。设置左边距和上边距相对以下对象所在的位置 1：光标位置；2：页边距；3：页面距离 4：默认设置栏，段落
				100,//缩放印章,默认100%
				1);   //0印章位于文字下方,1位于上方
				
			}
			catch(error){}
		}
		else
		{alert("不能在该类型文档中使用安全签名印章.");}
	}		
}
function addPicFromLocal()
{
	if(IsFileOpened)
	{
			try
			{
				OFFICE_CONTROL_OBJ.AddPicFromLocal("",//印章的用户名
					true,//缺省文件名
					false,//是否提示选择
					100,//左边距
					100,//上边距 根据Relative的设定选择不同参照对象
					1,  //Relative,取值1-4。设置左边距和上边距相对以下对象所在的位置 1：光标位置；2：页边距；3：页面距离 4：默认设置栏，段落
					100,//缩放印章,默认100%
					1);   //0印章位于文字下方,1位于上方
			}
			catch(error){}
	}
}

function TANGER_OCX_AddDocHeader(strHeader)
{
	if(!IsFileOpened)
	{return;}
	var i,cNum = 30;
	var lineStr = "";
	try
	{
		for(i=0;i<cNum;i++) lineStr += "_";  //生成下划线
		with(OFFICE_CONTROL_OBJ.ActiveDocument.Application)
		{
			Selection.HomeKey(6,0); // go home
			Selection.TypeText(strHeader);
			Selection.TypeParagraph(); 	//换行
			Selection.TypeText(lineStr);  //插入下划线
			// Selection.InsertSymbol(95,"",true); //插入下划线
			Selection.TypeText("★");
			Selection.TypeText(lineStr);  //插入下划线
			Selection.TypeParagraph();
			//Selection.MoveUp(5, 2, 1); //上移两行，且按住Shift键，相当于选择两行
			Selection.HomeKey(6,1);  //选择到文件头部所有文本
			Selection.ParagraphFormat.Alignment = 1; //居中对齐
			with(Selection.Font)
			{
				NameFarEast = "宋体";
				Name = "宋体";
				Size = 12;
				Bold = false;
				Italic = false;
				Underline = 0;
				UnderlineColor = 0;
				StrikeThrough = false;
				DoubleStrikeThrough = false;
				Outline = false;
				Emboss = false;
				Shadow = false;
				Hidden = false;
				SmallCaps = false;
				AllCaps = false;
				Color = 255;
				Engrave = false;
				Superscript = false;
				Subscript = false;
				Spacing = 0;
				Scaling = 100;
				Position = 0;
				Kerning = 0;
				Animation = 0;
				DisableCharacterSpaceGrid = false;
				EmphasisMark = 0;
			}
			Selection.MoveDown(5, 3, 0); //下移3行
		}
	}
	catch(err){
		alert("错误：" + err.number + ":" + err.description);
	}
	finally{
	}
}

function insertRedHeadFromUrl(headFileURL)
{
	if(OFFICE_CONTROL_OBJ.doctype!=1)//OFFICE_CONTROL_OBJ.doctype=1为word文档
	{return;}
	OFFICE_CONTROL_OBJ.ActiveDocument.Application.Selection.HomeKey(6,0);//光标移动到文档开头
	OFFICE_CONTROL_OBJ.addtemplatefromurl(headFileURL);//在光标位置插入红头文档
}
function openTemplateFileFromUrl(templateUrl)
{
	OFFICE_CONTROL_OBJ.openFromUrl(templateUrl);
}
function doHandSign()
{
	/*if(OFFICE_CONTROL_OBJ.doctype==1||OFFICE_CONTROL_OBJ.doctype==2)//此处设置只允许在word和excel中盖章.doctype=1是"word"文档,doctype=2是"excel"文档
	{*/
		OFFICE_CONTROL_OBJ.DoHandSign2(
									"ntko",//手写签名用户名称
									"ntko",//signkey,DoCheckSign(检查印章函数)需要的验证密钥。
									0,//left
									0,//top
									1,//relative,设定签名位置的参照对象.0：表示按照屏幕位置插入，此时，Left,Top属性不起作用。1：光标位置；2：页边距；3：页面距离 4：默认设置栏，段落（为兼容以前版本默认方式）
									100);
	//}
}
function SetReviewMode(boolvalue)
{
	if(OFFICE_CONTROL_OBJ.doctype==1)
	{
		OFFICE_CONTROL_OBJ.ActiveDocument.TrackRevisions = boolvalue;//设置是否保留痕迹
	}
} 

function setShowRevisions(boolevalue)
{
	if(OFFICE_CONTROL_OBJ.doctype==1)
	{
		OFFICE_CONTROL_OBJ.ActiveDocument.ShowRevisions =boolevalue;//设置是否显示痕迹
	}
}
function setFilePrint(boolvalue)
{
	OFFICE_CONTROL_OBJ.fileprint=boolvalue;//是否允许打印
}
function setFileNew(boolvalue)
{
	//alert("setFileNew");
	OFFICE_CONTROL_OBJ.FileNew=boolvalue;//是否允许新建
}
function setFileSaveAs(boolvalue)
{
	OFFICE_CONTROL_OBJ.FileSaveAs=boolvalue;//是否允许另存为
}

function setIsNoCopy(boolvalue)
{
	OFFICE_CONTROL_OBJ.IsNoCopy=boolvalue;//是否禁止粘贴
}
//验证文档控件自带印章功能盖的章
function DoCheckSign()
{
   if(IsFileOpened)
   {	
			var ret = OFFICE_CONTROL_OBJ.DoCheckSign
			(
			false,/*可选参数 IsSilent 缺省为FAlSE，表示弹出验证对话框,否则，只是返回验证结果到返回值*/
			"ntko"//使用盖章时的signkey,这里为"ntko"
			);//返回值，验证结果字符串
			//alert(ret);
   }	
}
//设置工具栏
function setToolBar()
{
	OFFICE_CONTROL_OBJ.ToolBars=!OFFICE_CONTROL_OBJ.ToolBars;
}
//控制是否显示所有菜单
function setMenubar()
{
		OFFICE_CONTROL_OBJ.Menubar=!OFFICE_CONTROL_OBJ.Menubar;
}
//控制”插入“菜单栏
function setInsertMemu()
{
		OFFICE_CONTROL_OBJ.IsShowInsertMenu=!OFFICE_CONTROL_OBJ.IsShowInsertMenu;
	}
//控制”编辑“菜单栏
function setEditMenu()
{
		OFFICE_CONTROL_OBJ.IsShowEditMenu=!OFFICE_CONTROL_OBJ.IsShowEditMenu;
	}
//控制”工具“菜单栏
function setToolMenu()
{
	OFFICE_CONTROL_OBJ.IsShowToolMenu=!OFFICE_CONTROL_OBJ.IsShowToolMenu;
	}
	
//自定义菜单功能函数
function initCustomMenus()
{
	var myobj = OFFICE_CONTROL_OBJ;	
	for(var menuPos=0;menuPos<3;menuPos++)
	{
		myobj.AddCustomMenu2(menuPos,"菜单"+menuPos+"(&"+menuPos+")"); 
		for(var submenuPos=0;submenuPos<10;submenuPos++)
		{
			if(1 ==(submenuPos % 3)) //主菜单增加分隔符。第3个参数是-1是在主菜单增加
			{
				myobj.AddCustomMenuItem2(menuPos,submenuPos,-1,false,"-",true);
			}
			else if(0 == (submenuPos % 2)) //主菜单增加子菜单，第3个参数是-1是在主菜单增加
			{
				myobj.AddCustomMenuItem2(menuPos,submenuPos,-1,true,"子菜单"+menuPos+"-"+submenuPos,false);
				//增加子菜单项目
				for(var subsubmenuPos=0;subsubmenuPos<9;subsubmenuPos++)
				{
					if(0 == (subsubmenuPos % 2))//增加子菜单项目
					{
						myobj.AddCustomMenuItem2(menuPos,submenuPos,subsubmenuPos,false,
							"子菜单项目"+menuPos+"-"+submenuPos+"-"+subsubmenuPos,false,menuPos*100+submenuPos*20+subsubmenuPos);
					}
					else //增加子菜单分隔
					{
						myobj.AddCustomMenuItem2(menuPos,submenuPos,subsubmenuPos,false,
							"-"+subsubmenuPos,true);
					}
					//测试禁用和启用
					if(2 == (subsubmenuPos % 4))
					{
						myobj.EnableCustomMenuItem2(menuPos,submenuPos,subsubmenuPos,false);
					}
				}				
			}
			else //主菜单增加项目，第3个参数是-1是在主菜单增加
			{
				myobj.AddCustomMenuItem2(menuPos,submenuPos,-1,false,"菜单项目"+menuPos+"-"+submenuPos,false,menuPos*100+submenuPos);
			}
			
			//测试禁用和启用
			if(1 == (submenuPos % 4))
			{
				myobj.EnableCustomMenuItem2(menuPos,submenuPos,-1,false);
			}
		}
	}
}

/*-------------------------流转公文打印部分：开始（添加时间：2013.5.15 作者：李超）------------------*/
var GwObj = {};//公文对象
GwObj.WordState = "GW";
function getWordState(){
	return GwObj.WordState;
}
/*----------------------备案：开始----------------------*/
/* 备案公文 */
function RestoreToBaiAnGW(){
	if(GwObj.WordState == "GW") return true;
	SetReviewMode(false);//打开保留痕迹（这条语句的位置很关键）
	var mydoc = OFFICE_CONTROL_OBJ.ActiveDocument; //得到Document对象
	mydoc.Application.PrintPreview = false;//关闭打印预览状态
	if(GwObj.WordState == "HQG"){
		DelHuiQianTemplate();
	}
	GwObj.WordState="GW";//标记状态
	SwitchButton(GwObj.WordState);
}
/* 备案会签稿 */
function BaiAnHQG(){
	OFFICE_CONTROL_OBJ.Activate(true);//激活当前文档对象，以免模板插入到别的文档中
	//关闭打印预览状态
	var mydoc = OFFICE_CONTROL_OBJ.ActiveDocument; 
	mydoc.Application.PrintPreview = false;
	setShowRevisions(false);//隐藏痕迹
	SetReviewMode(false);//关闭痕迹保留
	InsertTmplateFileAtEnd("BaHuiQianTemplateFile.doc");
	GwObj.WordState="HQG";//标记状态
	SwitchButton(GwObj.WordState);
	SetReviewMode(true);//打开痕迹保留
	return true;
}
//删除会签格子
function DelHuiQianTemplate(){
	var doc = OFFICE_CONTROL_OBJ.ActiveDocument;
	var count = doc.Tables.count;//删除最后一个表格
	var table = doc.Tables(count);
	var lastRow = table.Rows.Count;
	table.Rows(lastRow).Delete();//删除表格的最后一行
	return true;
}
/*--------------------------备案公文：结束--------------------------*/

/* 从其它状态恢复到公文 */
function RestoreToGW(){
	if(GwObj.WordState == "GW"){
		return true;
	}
	//OFFICE_CONTROL_OBJ.SetReadOnly(false, "");//关闭文档只读
	SetReviewMode(false);//打开保留痕迹（这条语句的位置很关键）
	var mydoc = OFFICE_CONTROL_OBJ.ActiveDocument; //得到Document对象
	mydoc.Application.PrintPreview = false;//关闭打印预览状态
	if(GwObj.WordState == "HQG"){
		if( GetTitleContent() == false || DeleteContentBeforeZW() == false ){
			return false;
		}
		InsertTmplateFileAtHome("NiwenHeaderTemplateFile.doc");
		OFFICE_CONTROL_OBJ.SetBookmarkValue("文号", GwObj.WHContent) ;
		OFFICE_CONTROL_OBJ.SetBookmarkValue("标题", GwObj.TitleContent) ;
	}
	if(GwObj.WordState == "HR"){
		ShowRedLine();
		ShowRedHead();
	}
	GwObj.WordState="GW";//标记状态
	SwitchButton(GwObj.WordState);
}
/* 会签稿 */
function HQGPrintOut(){
	OFFICE_CONTROL_OBJ.Activate(true);//激活当前文档对象，以免模板插入到别的文档中
	var nodebh = "190";
	if( $("#NODEBH").length > 0 ){
		var nodebh = $("#NODEBH").val();
	}
	//关闭打印预览状态
	var mydoc = OFFICE_CONTROL_OBJ.ActiveDocument; 
	mydoc.Application.PrintPreview = false;
	setShowRevisions(false);//隐藏痕迹
	SetReviewMode(false);//关闭痕迹保留
	if(GwObj.WordState == "HR"){
		ShowRedLine();
		ShowRedHead();
	}
	if(GetWHContent() == false || GetTitleContent() == false ){
		return false;
	}
	if(DeleteContentBeforeZW() == false){//该正文包括了主送单位
		return false;
	}
	DeleteBookMarkObjBeforeZW();
	if( nodebh == "190" ){ //发文环节
		InsertTmplateFileAtHome("FwHuiQianTemplateFile.doc");
		OFFICE_CONTROL_OBJ.SetBookmarkValue("文号", GwObj.WHContent) ;
		OFFICE_CONTROL_OBJ.SetBookmarkValue("标题", GwObj.TitleContent) ;
	}else{
		InsertTmplateFileAtHome("HuiQianTemplateFile.doc");
		OFFICE_CONTROL_OBJ.SetBookmarkValue("标题", GwObj.TitleContent) ;
	}
	GwObj.WordState="HQG";//标记状态
	SwitchButton(GwObj.WordState);
	SetReviewMode(true);//打开痕迹保留
	return true;
}
/* 不套红 */
function HideRed(){
	OFFICE_CONTROL_OBJ.Activate(true);
	//关闭打印预览状态
	var mydoc = OFFICE_CONTROL_OBJ.ActiveDocument; 
	if( mydoc.Application.PrintPreview == true){
		mydoc.Application.PrintPreview = false;
	}
	setShowRevisions(false);//隐藏痕迹
	SetReviewMode(false);//关闭痕迹保留（【公文】打开痕迹保留）
	if(GwObj.WordState == "HQG"){
		if( GetTitleContent() == false || DeleteContentBeforeZW() == false ){
			return false;
		}
		InsertTmplateFileAtHome("NiwenHeaderTemplateFile.doc");
		OFFICE_CONTROL_OBJ.SetBookmarkValue("文号", GwObj.WHContent) ;
		OFFICE_CONTROL_OBJ.SetBookmarkValue("标题", GwObj.TitleContent) ;
	}
	HideRedLine();
	HideRedHead();
	GwObj.WordState="HR";//标记状态
	SwitchButton(GwObj.WordState);
}
//获取文号
function GetWHContent(){
	var BookMarkName = "文号";
	if(ValidateBookMark(BookMarkName) == false){
		return false;
	}
	GwObj.WHContent = OFFICE_CONTROL_OBJ.GetBookmarkValue(BookMarkName);//
	return true;
}
//获取标题
function GetTitleContent(){
	var BookMarkName = "标题";
	if(ValidateBookMark(BookMarkName) == false){
		return false;
	}
	GwObj.TitleContent = OFFICE_CONTROL_OBJ.GetBookmarkValue(BookMarkName);
	return true;
}
//删除正文以上的文档内容
function DeleteContentBeforeZW(){
	//思路：选中文档开始位置，再把开始位置和【标题】书签的{结束位置}这之间的整体作为一个范围
	var mydoc = OFFICE_CONTROL_OBJ.ActiveDocument; //得到Document对象
	var app = mydoc.Application; //得到Application对象
	var sel = app.Selection; //得到Selection对象
	var start = 0;//设定文档的开始位置
	var BookMarkName = "标题";
	if(ValidateBookMark(BookMarkName) == false){
		return false;
	}
	var end = mydoc.BookMarks(BookMarkName).End;//该书签在文档的结束位置
	
	mydoc.Range(start, end+2 ).Delete();//删除
	//sel.TypeParagraph(); //换行
	return true;
}
//删除正文以上的书签对象
function DeleteBookMarkObjBeforeZW(){
	//删除书签对象（避免与模板文件中的书签命名冲突）
	DeleteBookMark("红头");
	DeleteBookMark("红线");
	DeleteBookMark("文号");	
	DeleteBookMark("标题");	
}

//插入模板文件到文档顶端（该函数功能可以单独测试）
function InsertTmplateFileAtHome( fileName ){
	var mydoc = OFFICE_CONTROL_OBJ.ActiveDocument; //得到Document对象
	var app = mydoc.Application; //得到Application对象
	var sel = app.Selection; //得到Selection对象
	//将光标移到文档开始位置
	sel.HomeKey(6);
	//在光标处插入模板
	OFFICE_CONTROL_OBJ.AddTemplateFromURL("../../../ntko/spglTemplateFile/"+fileName, true);//模板路径是相对当前网页的URL
}
//插入模板文件到文档底端
function InsertTmplateFileAtEnd( fileName ){
	var mydoc = OFFICE_CONTROL_OBJ.ActiveDocument; //得到Document对象
	var app = mydoc.Application; //得到Application对象
	var sel = app.Selection; //得到Selection对象
	//将光标移到文档末尾位置
	sel.EndKey(6);
	//在光标处插入模板
	OFFICE_CONTROL_OBJ.AddTemplateFromURL("../../../ntko/spglTemplateFile/"+fileName, true);//模板路径是相对当前网页的URL
	//AddTemplateFromURL会引起空行，删除文档最后的多余空行
	sel.endkey(6);
    var endline = sel.information(10);//光标在某行
    sel.GoTo(-1,0,0,"会签格子");
    var bookmarkline = sel.information(10);//光标在某行
    //alert( "endline="+endline+",bookmarkline="+bookmarkline );
    var num = endline-bookmarkline;
    sel.endkey(6);
    for(var i=1;i<=num;i++){
    	sel.Delete();
    }
}
function ShowRedLine(){
	OFFICE_CONTROL_OBJ.ActiveDocument.bookmarks('红线').range.ShapeRange(1).Line.ForeColor.RGB = 255;
}
function HideRedLine(){
	OFFICE_CONTROL_OBJ.ActiveDocument.bookmarks('红线').range.ShapeRange(1).Line.ForeColor.RGB = 16777215;
}
function ShowRedHead(){
	OFFICE_CONTROL_OBJ.ActiveDocument.Bookmarks('红头').Range.Font.Color = 255;
}
function HideRedHead(){
	OFFICE_CONTROL_OBJ.ActiveDocument.Bookmarks('红头').Range.Font.Color = 16777215;
}
//
function SwitchButton( WordState ){
	var IsDisabled = false;
	var IsDisabled_HQG = false;
	var IsDisabled_HR = false;
	if( WordState == "HQG" ){
		IsDisabled = true ;
		IsDisabled_HQG = true;
	}else if( WordState == "HR" ){
		IsDisabled = true ;
		IsDisabled_HR = true;
	}
	//officeEdit
	if( document.getElementById("HQGPrint")){
		document.getElementById("HQGPrint").disabled = IsDisabled_HQG ;
	}
	if( document.getElementById("HR")){
		document.getElementById("HR").disabled = IsDisabled_HR ;
	}
	if( document.getElementById("SaveGW")){//保存（id：save 有冲突）
		document.getElementById("SaveGW").disabled = IsDisabled ;
	}
	//tab
	var oDoc = top.parent.document;
	if( oDoc.getElementById("btn_submit") ){//tab上的提交
		oDoc.getElementById("btn_submit").disabled = IsDisabled ;
	}
	if( oDoc.getElementById("save")){//tab上的保存
		oDoc.getElementById("save").disabled = IsDisabled ;
	}
	if( oDoc.getElementById("btn_tb")){//tab上的退办（拟文）
		oDoc.getElementById("btn_tb").disabled = IsDisabled ;
	}
	if( oDoc.getElementById("btn_refuse")){//tab上的回退（拟文）
		oDoc.getElementById("btn_refuse").disabled = IsDisabled ;
	}
	if( oDoc.getElementById("restore")){//tab上的还原（拟文）
		oDoc.getElementById("restore").disabled = IsDisabled ;
	}
}

//验证书签是否存在
function ValidateBookMark(BookMarkName){
	if( !OFFICE_CONTROL_OBJ.ActiveDocument.BookMarks.Exists(BookMarkName) ){
		alert("公文中不存在名称为：\""+BookMarkName+"\"的书签！");
		return false;
	}
	return true;
}
//延迟函数
function delay(){
	for(var i=0; i<5999999; i++);
}
//撤销
function undo( StepNum ){
	OFFICE_CONTROL_OBJ.activedocument.undo( StepNum );
}
//删除书签对象
function DeleteBookMark(BookMarkName){
	try{
		var bkmkObj = OFFICE_CONTROL_OBJ.ActiveDocument.BookMarks(BookMarkName);
		bkmkObj.Delete();
	}catch(e){
		//alert("公文中不存在名称为：\""+BookMarkName+"\"的书签！");
	}
}
//另存为
function mysaveAs(){
	var TANGER_OCX = document.getElementById("TANGER_OCX");
	SetReviewMode(false);//关闭痕迹保留
	//另存为文件名
	if(ValidateBookMark('标题') && ValidateBookMark('文号') ){
		var bt = TANGER_OCX.GetBookmarkValue('标题');
		var wh = TANGER_OCX.GetBookmarkValue('文号');
		bt = bt.replace(/[\r\n]/g, "");//过滤换行符
		TANGER_OCX.WebFileName=wh+bt+".doc";
	}
	TANGER_OCX.ActiveDocument.AcceptAllRevisions();//接受所有的修订
	TANGER_OCX.ShowDialog(2);//打开保存窗口
	TANGER_OCX.activedocument.undo( 1 );//取消“接受所有修订”
	SetReviewMode(true);//开启痕迹保留
}
//验证书签是否存在
function ValidateBookMark(BookMarkName){
	var TANGER_OCX = document.getElementById("TANGER_OCX");
	if( !TANGER_OCX.ActiveDocument.BookMarks.Exists(BookMarkName) ){
		return false;
	}
	return true;
}
/*预览*/
function PrintPreview(){
	//第二次点击是关闭预览状态
	OFFICE_CONTROL_OBJ.PrintPreview() ;
}
/**********************************流转公文打印部分：结束*********************************************/









/*
function HideBookMark(BookMarkName){
	//
	var bkmkObj = OFFICE_CONTROL_OBJ.ActiveDocument.BookMarks(BookMarkName);
	if(!bkmkObj){
		alert("Word 模板中不存在名称为：\""+BookMarkName+"\"的书签！");
		return;
	}
	var saverange = bkmkObj.Range;
	saverange.Text = '';
	OFFICE_CONTROL_OBJ.ActiveDocument.Bookmarks.Add(BookMarkName, saverange);
}



//删除标题以上的部分（该函数功能可以单独测试）
//bug：只删除奇数段落
//状态：丢弃
//function DeleteBeforeTitle(){
//	var mydoc = OFFICE_CONTROL_OBJ.ActiveDocument; //得到Document对象
//	with(mydoc.Paragraphs){
//		for(var i=1; i<Count; i++){
//			with(Item(i).Range){
//				if( Bookmarks.Exists("标题") == true ){
//					return ;
//				}
//				Delete();
//			}
//		}
//	}
//}
*/



function TANGER_OCX_DoPaiBan(URL){
	var TANGER_OCX_OBJ = document.all("TANGER_OCX");
	try{
		TANGER_OCX_OBJ.ActiveDocument.Application.Selection.GoTo(3,1,6,"");//第三个参数：行位置
		TANGER_OCX_OBJ.ActiveDocument.Application.Selection.MoveDown(5,99,1);//第一个参数光标以行向下移动,第二个参数：行数
		var gw = TANGER_OCX_OBJ.ActiveDocument.Application.Selection;
		gw.Copy();
		

		TANGER_OCX_OBJ.ActiveDocument.Application.Selection.MoveDown(5,99,1);//第一个参数光标以行向下移动,第二个参数：行数
		//TANGER_OCX_SetMarkModify(false);
		//curSel.WholeStory();
		//curSel.Cut();
		//插入模板
		TANGER_OCX_OBJ.AddTemplateFromURL(URL);
		var BookMarkName = "公文";
		var bkmkObj = TANGER_OCX_OBJ.ActiveDocument.BookMarks(BookMarkName);//若错了，就直接异常，不会执行下面的判断
		var saverange = bkmkObj.Range; 
		saverange.Paste();
		//saverange.Paste();
		//TANGER_OCX_OBJ.ActiveDocument.Bookmarks.Add(BookMarkName,saverange);		
		TANGER_OCX_OBJ.ActiveDocument.Bookmarks.Add(BookMarkName, saverange);		
		//TANGER_OCX_SetMarkModify(true);
	}catch(err)	{
		alert("错误：" + err.number + ":" + err.description);
	};
}

function getfirstlinetext(){
	//选择当前文档的指定内容
	var TANGER_OCX_OBJ = document.all("TANGER_OCX");
	TANGER_OCX_OBJ.ActiveDocument.Application.Selection.GoTo(3,1,6,"");//第三个参数：行位置
	TANGER_OCX_OBJ.ActiveDocument.Application.Selection.MoveDown(5,99,1);//第一个参数光标以行向下移动,第二个参数：行数
	alert(TANGER_OCX_OBJ.ActiveDocument.Application.Selection.Range.Text);
}

function CopyTextToBookMark(inputValue, BookMarkName){
	try{
		if(inputValue == ''){
			return; //空，则不替换
		}
		var TANGER_OCX = document.all("TANGER_OCX");
		
		var bkmkObj = TANGER_OCX.ActiveDocument.BookMarks(BookMarkName);
		if(!bkmkObj){
			alert("Word 模板中不存在名称为：\""+BookMarkName+"\"的书签！");
		}
		var saverange = bkmkObj.Range;
		saverange.Text = inputValue;
		TANGER_OCX.ActiveDocument.Bookmarks.Add(BookMarkName, saverange);
	}
	catch(err){
		alert("CopyTextToBookMark "+err.number + ":" + err.description);
	}
	finally{
	}		
}

function CNDateString(date){
	var arr = date.split('-');
	  var cn = ["〇","一","二","三","四","五","六","七","八","九"];
	  var result = [];
	  /*年*/
	  var YYYY = arr[0];
	  for (var i=0; i<YYYY.length; i++){
		  if( cn[YYYY.charAt(i)] ){
			  result.push(cn[YYYY.charAt(i)]);
		  }else{
			  result.push(YYYY.charAt(i));
		  }
	  }
	  result.push("年");
	  /*月*/
	  var M = arr[1];
	  M = parseInt(M,10);//10进制
	  var remainder = ((M%10)==0 ? "" : cn[M%10]);//过滤10中的零
	  if( M<10 ){
		  result.push(cn[M]);
	  }else if( M<20 ){
		  result.push("十" + remainder );
	  }
	  result.push("月");
	  /*日*/
	  var DD = arr[2];
	  DD = parseInt(DD, 10);//10进制
	  remainder = ((DD%10)==0 ? "" : cn[DD% 10]);//过滤10、20、30中的零
	  if(DD<10){
		  result.push(cn[DD]);
	  }else if(DD<20){
		  result.push("十" + remainder );
	  }else if(DD<30){
		  result.push("二十" + remainder );
	  }else{
		  result.push("三十" + remainder );
	  }
	  result.push("日"); 
	  
	  return result.join('');
}

function CopyTableToWord(tableObj)
{
	//alert("CopyTableToWord");
	var ocxObj = document.all("TANGER_OCX"); //获得控件对象
	 //获得浏览器中table对象
	var tableRows = tableObj.rows.length; //获得table行数
	var tableCols = tableObj.rows(0).cells.length; //获得table列数，假设每行的列数都一样
	//创建一个word文档
	ocxObj.CreateNew("word.Document");
	//在Word文档中插入tableRows行，tableCols列的表格
	var curSel = ocxObj.ActiveDocument.Application.Selection;
	curSel.EndKey(6); //跳转到文档尾部
	var newtable = ocxObj.ActiveDocument.Tables.Add(curSel.Range, tableRows, tableCols);
	//设定word表格边框
	newtable.Borders.InsideLineStyle = true;
	newtable.Borders.InsideLineStyle = 1;
	newtable.Borders.OutsideLineStyle = 7;
	//拷贝html表格值到word表格对象
	for (i=0; i < tableObj.rows.length; i++){
		for (j=0; j < tableObj.rows(i).cells.length; j++) { 
			newtable.Cell(i+1,j+1).Range.InsertAfter(tableObj.rows(i).cells(j).innerText); 
		}
	}
}


// addtime：2013-3-6 



//(2)要获取文档的修改信息可以调用代码:
function TANGER_OCX_Revisions(){
	var rev="";
	var TANGER_OCX_OBJ = document.all("TANGER_OCX");
	var cou=TANGER_OCX_OBJ.ActiveDocument.Revisions.Count;//获取修订的数目
	for(var i=1;i<=cou;i++){
		var typ="";
		var range=TANGER_OCX_OBJ.ActiveDocument.Revisions(i).Range;//获取修改的内容
		//判断修订类型,值1为插入,值2为删除
		if(1==TANGER_OCX_OBJ.ActiveDocument.Revisions(i).TYPE){
			typ="插入修订";
		}else{
			typ="删除修订";
		} 
		rev+=(TANGER_OCX_OBJ.ActiveDocument.Revisions(i).Author+":"+typ+"内容 "+range+"\n");
	} 
	alert(rev);
}

//设置word滚动条是否显示
function ScrollBar(){
	var TANGER_OCX_OBJ = document.all("TANGER_OCX");
    if(TANGER_OCX_OBJ.doctype == 1){ // word才有滚动条
        //水平滚动条
	    TANGER_OCX_OBJ.ActiveDocument.ActiveWindow.DisplayHorizontalScrollBar = false;
        //垂直滚动条
    	TANGER_OCX_OBJ.ActiveDocument.ActiveWindow.DisplayVerticalScrollBar = true;
    }
}

function toggerScrollBar(){
	var TANGER_OCX_OBJ = document.all("TANGER_OCX");
    if(TANGER_OCX_OBJ.doctype == 1) { // word才有滚动条
        //水平滚动条
        TANGER_OCX_OBJ.ActiveDocument.ActiveWindow.DisplayHorizontalScrollBar = !TANGER_OCX_OBJ.ActiveDocument.ActiveWindow.DisplayHorizontalScrollBar;
        //垂直滚动条
        TANGER_OCX_OBJ.ActiveDocument.ActiveWindow.DisplayVerticalScrollBar = !TANGER_OCX_OBJ.ActiveDocument.ActiveWindow.DisplayVerticalScrollBar;
    }
}

function hiddenToolbar(){
    var TANGER_OCX_OBJ = document.all("TANGER_OCX");
    TANGER_OCX_OBJ.toolbars = false;

}




