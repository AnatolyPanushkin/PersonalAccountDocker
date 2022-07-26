using System.Collections;
using Microsoft.EntityFrameworkCore;
using PersonalAccount.Data;
using PersonalAccount.Mapper;

namespace PersonalAccount.Services;

public class PersonalAccService:IPersonalAccService
{
    private readonly AirCompaniesContext _context;
    private readonly IConfiguration _configuration;
    public PersonalAccService(AirCompaniesContext context, IConfiguration configuration)
    {
        _context = context;
        _configuration = configuration;
    }
    
    public async Task<ICollection<DataAll>> ByDocNumberAsync(ByDocNumber byDocNumber)
    {
        var sqlPath = _configuration.GetSection("SqlQueriesPaths")["ByDocNumber"];
        StreamReader stream = new StreamReader(sqlPath); 
        
        string? buffer = await stream.ReadToEndAsync();
        
        string? parameterizedSqlRow = string.Format(buffer,byDocNumber.DocNumber) ;
        
        var result = await _context.DataAlls.FromSqlRaw(parameterizedSqlRow).ToListAsync();
        return result;
    }

    public async Task<ICollection<DataAll>> ByTicketNumberAsync(ByTicketNumber byTicketNumber)
    {
        string request = "";
        if (byTicketNumber.CheckBox)
        {
            StreamReader stream = new StreamReader(_configuration.GetSection("SqlQueriesPaths")["ByTicketNumberAll"]);
            string? buffer = await stream.ReadToEndAsync();
            request = string.Format(buffer,byTicketNumber.TicketNumber) ;
        }
        else
        {
            StreamReader stream = new StreamReader(_configuration.GetSection("SqlQueriesPaths")["ByTicketNumberSelected"]);
            string? buffer = await stream.ReadToEndAsync();
            request = string.Format(buffer, byTicketNumber.TicketNumber) ; 
        }
        
        var result = await _context.DataAlls.FromSqlRaw(request).ToListAsync();
        return result;
    }

    public async Task<ICollection<PrintXlsx>> ByDocNumberPrintAsync(ByDocNumberPrint byDocNumberPrint)
    {
        StreamReader stream = new StreamReader(_configuration.GetSection("SqlQueriesPaths")["PrintByDocNumber"]);
        string? buffer = await stream.ReadToEndAsync();
        string? parameterizedSqlRow = string.Format(buffer,byDocNumberPrint.AirlineCompanyIataCode, byDocNumberPrint.DocNumber) ;
        var result = await _context.DataAlls.FromSqlRaw(parameterizedSqlRow).ToListAsync();
        return result.MapToFromatForPrint();
    }

    public async Task<ICollection<PrintXlsx>> ByTicketNumberPrintAsync(ByTicketNumberPrint byTicketNumberPrint)
    {
        string request = "";
        if (byTicketNumberPrint.ByTicketNumberCheckBox)
        {
            StreamReader stream = new StreamReader(_configuration.GetSection("SqlQueriesPaths")["ByTicketNumberPrintAll"]);
            string? buffer = await stream.ReadToEndAsync();
            request = string.Format(buffer,byTicketNumberPrint.AirlineCompanyIataCode, byTicketNumberPrint.TicketNumber) ;
            
        }
        else
        {
            StreamReader stream = new StreamReader(_configuration.GetSection("SqlQueriesPaths")["ByTicketNumberPrintSelected"]);
            string? buffer = await stream.ReadToEndAsync();
            request = string.Format(buffer,byTicketNumberPrint.AirlineCompanyIataCode, byTicketNumberPrint.TicketNumber) ;
        }
        
        
        var result = await _context.DataAlls.FromSqlRaw(request).ToListAsync();
        return result.MapToFromatForPrint();
    }

    public async Task<ICollection<DataAll>> XlsxByTicketNumber(ByTicketNumberPrint byTicketNumberPrint)
    {
        string request = "";
        if (byTicketNumberPrint.ByTicketNumberCheckBox)
        {
            StreamReader stream = new StreamReader("SqlRows\\ByTicketNumberPrintAllTicketSql.txt");
            string? buffer = await stream.ReadToEndAsync();
            request = string.Format(buffer,byTicketNumberPrint.AirlineCompanyIataCode, byTicketNumberPrint.TicketNumber) ;
            
        }
        else
        {
            StreamReader stream = new StreamReader("SqlRows\\ByTicketNumberPrintSelectedTicketSql.txt");
            string? buffer = await stream.ReadToEndAsync();
            request = string.Format(buffer,byTicketNumberPrint.AirlineCompanyIataCode, byTicketNumberPrint.TicketNumber) ;
        }
         
        var result = await _context.DataAlls.FromSqlRaw(request).ToListAsync();
        return result;
        
    }

    public async Task<ICollection<AirlineCompany>> GetAllAirCompanies()
    {
        var sqlPath = _configuration.GetSection("SqlQueriesPaths")["AirCompanies"];
        StreamReader stream = new StreamReader(sqlPath); 
        
        string? buffer = await stream.ReadToEndAsync();
        
        string? parameterizedSqlRow = string.Format(buffer) ;
        
        var result = await _context.AirlineCompany.FromSqlRaw(parameterizedSqlRow).ToListAsync();
        return result;
    }
    
}