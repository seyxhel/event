import csv
import io
import json
from datetime import datetime

from django.db.models import Q
from django.http import FileResponse, HttpResponse, JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
from reportlab.lib.pagesizes import A4
from reportlab.pdfgen import canvas

from .forms import EventRegistrationForm
from .models import EventRegistration


def _with_cors_headers(response: JsonResponse) -> JsonResponse:
	response['Access-Control-Allow-Origin'] = '*'
	response['Access-Control-Allow-Methods'] = 'GET, POST, OPTIONS'
	response['Access-Control-Allow-Headers'] = 'Content-Type'
	return response


def _format_reference(registration: EventRegistration) -> str:
	date_part = registration.created_at.strftime('%Y-%m%d')
	sequence = f'{registration.id:04d}'
	return f'MISI-{date_part}-{sequence}'


def _serialize_registration(registration: EventRegistration):
	return {
		'id': registration.id,
		'reference': _format_reference(registration),
		'refNumber': _format_reference(registration),
		'privacyAccepted': registration.data_privacy_consent,
		'email': registration.email,
		'lastName': registration.last_name,
		'firstName': registration.first_name,
		'middleInitial': registration.middle_initial,
		'designation': registration.designation,
		'mobileNo': registration.mobile_cp_no,
		'viberNo': registration.viber_no,
		'gcashNo': registration.gcash_no,
		'personalEmail': registration.personal_email_address,
		'companyName': registration.company_name,
		'industryType': registration.industry_type,
		'companyAddress': registration.company_office_address,
		'companyLandline': registration.company_landline_no,
		'companyEmail': registration.company_email_address,
		'companyIdToBring': registration.company_id_to_bring,
		'bringCompanyId': registration.company_id_to_bring,
		'vehicleType': registration.vehicle_type,
		'willCome': registration.will_come,
		'attendeeCount': registration.attendee_count,
		'createdAt': registration.created_at.isoformat(),
		'date': registration.created_at.isoformat(),
	}


def _parse_bool_flag(value):
	if value is None:
		return None
	lower = value.strip().lower()
	if lower in {'true', '1', 'yes'}:
		return True
	if lower in {'false', '0', 'no'}:
		return False
	return None


def _map_payload(payload):
	return {
		'data_privacy_consent': payload.get('privacyAccepted'),
		'email': payload.get('email', ''),
		'last_name': payload.get('lastName', ''),
		'first_name': payload.get('firstName', ''),
		'middle_initial': payload.get('middleInitial', ''),
		'designation': payload.get('designation', ''),
		'mobile_cp_no': payload.get('mobileNo', ''),
		'viber_no': payload.get('viberNo', ''),
		'gcash_no': payload.get('gcashNo', ''),
		'personal_email_address': payload.get('personalEmail', ''),
		'company_name': payload.get('companyName', ''),
		'industry_type': payload.get('industryType', ''),
		'company_office_address': payload.get('companyAddress', ''),
		'company_landline_no': payload.get('companyLandline', ''),
		'company_email_address': payload.get('companyEmail', ''),
		'company_id_to_bring': payload.get('companyIdToBring'),
		'vehicle_type': payload.get('vehicleType', ''),
		'will_come': payload.get('willCome'),
		'attendee_count': payload.get('attendeeCount', 0),
	}


@csrf_exempt
@require_http_methods(['POST', 'OPTIONS'])
def register_api(request):
	if request.method == 'OPTIONS':
		return _with_cors_headers(JsonResponse({'ok': True}))

	try:
		payload = json.loads(request.body.decode('utf-8'))
	except (json.JSONDecodeError, UnicodeDecodeError):
		return _with_cors_headers(JsonResponse({'error': 'Invalid JSON payload.'}, status=400))

	form = EventRegistrationForm(_map_payload(payload))
	if not form.is_valid():
		return _with_cors_headers(JsonResponse({'success': False, 'errors': form.errors}, status=400))

	registration = form.save()
	response_payload = {
		'success': True,
		'reference': _format_reference(registration),
		'createdAt': registration.created_at.isoformat(),
		'firstName': registration.first_name,
		'lastName': registration.last_name,
		'email': registration.email,
	}
	return _with_cors_headers(JsonResponse(response_payload, status=201))


@require_http_methods(['GET'])
def manage_registrations_api(request):
	registrations = EventRegistration.objects.all()

	search_query = request.GET.get('q', '').strip()
	if search_query:
		registrations = registrations.filter(
			Q(first_name__icontains=search_query)
			| Q(last_name__icontains=search_query)
			| Q(email__icontains=search_query)
			| Q(company_name__icontains=search_query)
			| Q(vehicle_type__icontains=search_query)
		)

	will_come_flag = _parse_bool_flag(request.GET.get('will_come'))
	if will_come_flag is not None:
		registrations = registrations.filter(will_come=will_come_flag)

	date_from = request.GET.get('date_from', '').strip()
	if date_from:
		try:
			parsed_date_from = datetime.strptime(date_from, '%Y-%m-%d').date()
			registrations = registrations.filter(created_at__date__gte=parsed_date_from)
		except ValueError:
			pass

	date_to = request.GET.get('date_to', '').strip()
	if date_to:
		try:
			parsed_date_to = datetime.strptime(date_to, '%Y-%m-%d').date()
			registrations = registrations.filter(created_at__date__lte=parsed_date_to)
		except ValueError:
			pass

	try:
		page = int(request.GET.get('page', '1'))
	except ValueError:
		page = 1
	page = max(page, 1)

	try:
		page_size = int(request.GET.get('page_size', '10'))
	except ValueError:
		page_size = 10
	page_size = min(max(page_size, 1), 100)

	total = registrations.count()
	total_pages = max((total + page_size - 1) // page_size, 1)
	if page > total_pages:
		page = total_pages

	start_index = (page - 1) * page_size
	end_index = start_index + page_size
	paged_results = registrations[start_index:end_index]

	results = [_serialize_registration(item) for item in paged_results]
	return JsonResponse(
		{
			'results': results,
			'pagination': {
				'page': page,
				'pageSize': page_size,
				'total': total,
				'totalPages': total_pages,
				'hasNext': page < total_pages,
				'hasPrevious': page > 1,
			},
		}
	)


@require_http_methods(['GET'])
def export_registrations_csv(request):
	response = HttpResponse(content_type='text/csv')
	response['Content-Disposition'] = 'attachment; filename="event_registrations.csv"'

	writer = csv.writer(response)
	writer.writerow([
		'Reference',
		'Email',
		'Last Name',
		'First Name',
		'Middle Initial',
		'Designation',
		'Mobile/CP No.',
		'Viber No.',
		'G-Cash No.',
		'Personal Email',
		'Company Name',
		'Industry Type',
		'Company Office Address',
		'Company Landline No.',
		'Company Email',
		'Company ID To Bring',
		'Vehicle Type',
		'Will Come',
		'Attendee Count',
		'Submitted At',
	])

	for row in EventRegistration.objects.all():
		writer.writerow([
			_format_reference(row),
			row.email,
			row.last_name,
			row.first_name,
			row.middle_initial,
			row.designation,
			row.mobile_cp_no,
			row.viber_no,
			row.gcash_no,
			row.personal_email_address,
			row.company_name,
			row.industry_type,
			row.company_office_address,
			row.company_landline_no,
			row.company_email_address,
			'Yes' if row.company_id_to_bring else 'No',
			row.vehicle_type,
			'Yes' if row.will_come else 'No',
			row.attendee_count,
			row.created_at.strftime('%Y-%m-%d %H:%M:%S'),
		])

	return response


@require_http_methods(['GET'])
def export_registrations_pdf(request):
	buffer = io.BytesIO()
	pdf = canvas.Canvas(buffer, pagesize=A4)
	width, height = A4

	pdf.setFont('Helvetica-Bold', 14)
	pdf.drawString(40, height - 40, 'Maptech Event Registrations')
	pdf.setFont('Helvetica', 10)
	pdf.drawString(40, height - 58, 'The Cybersecurity Implementation Journey')

	y = height - 90
	for row in EventRegistration.objects.all():
		if y < 70:
			pdf.showPage()
			y = height - 50
			pdf.setFont('Helvetica-Bold', 12)
			pdf.drawString(40, y, 'Maptech Event Registrations (cont.)')
			y -= 24

		pdf.setFont('Helvetica-Bold', 10)
		pdf.drawString(40, y, f'{_format_reference(row)} | {row.last_name}, {row.first_name}')
		y -= 14
		pdf.setFont('Helvetica', 9)
		line_1 = f'Company: {row.company_name} | Designation: {row.designation}'
		line_2 = f'Email: {row.email} | Mobile: {row.mobile_cp_no} | Submitted: {row.created_at.strftime("%Y-%m-%d %H:%M")}'
		line_3 = f'Vehicle: {row.vehicle_type} | Will Come: {"Yes" if row.will_come else "No"} | Count: {row.attendee_count} | Company ID: {"Yes" if row.company_id_to_bring else "No"}'
		pdf.drawString(50, y, line_1[:120])
		y -= 12
		pdf.drawString(50, y, line_2[:120])
		y -= 12
		pdf.drawString(50, y, line_3[:120])
		y -= 18

	pdf.save()
	buffer.seek(0)
	return FileResponse(buffer, as_attachment=True, filename='event_registrations.pdf')
